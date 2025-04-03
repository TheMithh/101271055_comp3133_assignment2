import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../shared/models/employee.model';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <div class="detail-card">
        <div class="card-header">
          <h2>Employee Details</h2>
          <div class="header-actions">
            <button class="btn btn-outline" [routerLink]="['/employees/edit', employee?.id]">Edit</button>
            <button class="btn btn-outline" routerLink="/employees">Back to List</button>
          </div>
        </div>
        
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading employee details...</p>
        </div>
        
        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div *ngIf="!loading && employee" class="employee-details">
          <div class="profile-section">
            <div class="profile-photo">
              <img *ngIf="employee.employee_photo" [src]="employee.employee_photo" alt="Employee Photo">
              <div *ngIf="!employee.employee_photo" class="no-photo">
                <span>{{ getInitials(employee.first_name, employee.last_name) }}</span>
              </div>
            </div>
            
            <div class="profile-info">
              <h3>{{ employee.first_name }} {{ employee.last_name }}</h3>
              <p class="designation">{{ employee.designation }}</p>
              <p class="department">{{ employee.department }}</p>
            </div>
          </div>
          
          <div class="detail-section">
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">{{ employee.email }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Gender:</div>
              <div class="detail-value">{{ employee.gender }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Date of Joining:</div>
              <div class="detail-value">{{ formatDate(employee.date_of_joining) }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Salary:</div>
              <div class="detail-value">{{ employee.salary | currency }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Created At:</div>
              <div class="detail-value">{{ formatDate(employee.created_at) }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">Updated At:</div>
              <div class="detail-value">{{ formatDate(employee.updated_at) }}</div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-danger" (click)="deleteEmployee()">Delete Employee</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .detail-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    h2 {
      margin: 0;
      color: #333;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-outline {
      background-color: transparent;
      border: 1px solid #007bff;
      color: #007bff;
    }
    .btn-outline:hover {
      background-color: #007bff;
      color: white;
    }
    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
    .btn-danger:hover {
      background-color: #c82333;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 2rem 0;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      margin-bottom: 1rem;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .alert {
      padding: 0.75rem 1.25rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .profile-section {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 8px;
      overflow: hidden;
    }
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-photo {
      width: 100%;
      height: 100%;
      background-color: #e9ecef;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      font-weight: bold;
      color: #6c757d;
    }
    .profile-info h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }
    .designation {
      font-size: 1.25rem;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }
    .department {
      font-size: 1rem;
      color: #6c757d;
      background-color: #e9ecef;
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    .detail-section {
      margin-bottom: 2rem;
    }
    .detail-row {
      display: flex;
      margin-bottom: 1rem;
    }
    .detail-label {
      width: 150px;
      font-weight: 600;
      color: #495057;
    }
    .detail-value {
      flex: 1;
    }
    .action-buttons {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

// In employee-detail.component.ts - add some logging to see the raw date values
ngOnInit(): void {
  this.loading = true;
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.employeeService.getEmployeeById(id)
      .subscribe({
        next: (data) => {
          if (!data || !data.id) {
            this.error = 'Failed to load employee details: Invalid employee data returned';
            this.loading = false;
            return;
          }
          
          this.employee = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading employee:', error);
          this.error = 'Failed to load employee details. ' + 
                      (error.message || error.graphQLErrors?.[0]?.message || 'Unknown error');
          this.loading = false;
        }
      });
  } else {
    this.error = 'Employee ID is required';
    this.loading = false;
  }
}

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

 // In employee-detail.component.ts
formatDate(date: Date | string | number | undefined): string {
  if (!date) return 'N/A';
  
  try {
    // Convert to Date object regardless of input type
    let dateObj: Date;
    
    if (typeof date === 'number' || !isNaN(Number(date))) {
      // If it's a timestamp (either number or numeric string)
      dateObj = new Date(typeof date === 'string' ? Number(date) : date);
    } else if (typeof date === 'string') {
      // Regular date string
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      // Already a Date object
      dateObj = date;
    } else {
      return String(date);
    }
    
    // Check if date is valid before formatting
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Return original value if conversion failed
    return String(date);
  } catch (error) {
    console.error('Error formatting date:', error, 'Original value:', date);
    return String(date);
  }
}

  deleteEmployee(): void {
    if (!this.employee || !this.employee.id) return;
    
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(this.employee.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.error = 'Failed to delete employee. ' + (error.message || '');
          }
        });
    }
  }
}