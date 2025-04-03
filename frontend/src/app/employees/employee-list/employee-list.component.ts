import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../shared/models/employee.model';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="employee-list-container">
      <div class="employee-header">
        <h2>Employee Management</h2>
        <button routerLink="/employees/add" class="btn btn-primary">Add Employee</button>
      </div>

      <div class="search-filters">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <div class="form-group">
            <label for="department">Department</label>
            <select id="department" formControlName="department" class="form-select">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="designation">Designation</label>
            <select id="designation" formControlName="designation" class="form-select">
              <option value="">All Designations</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Analyst">Analyst</option>
              <option value="HR Specialist">HR Specialist</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-secondary">Search</button>
          <button type="button" class="btn btn-outline-secondary" (click)="resetSearch()">Reset</button>
        </form>
      </div>

      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="7" class="text-center">
                <div class="spinner"></div>
                <p>Loading employees...</p>
              </td>
            </tr>
            <tr *ngIf="!loading && employees.length === 0">
              <td colspan="7" class="text-center">No employees found</td>
            </tr>
            <tr *ngFor="let employee of employees">
              <td>{{ employee.first_name }}</td>
              <td>{{ employee.last_name }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.designation }}</td>
              <td>{{ employee.salary | currency }}</td>
              <td class="actions">
                <button class="btn-icon btn-view" [routerLink]="['/employees/view', employee.id]">
                  View
                </button>
                <button class="btn-icon btn-edit" [routerLink]="['/employees/edit', employee.id]">
                  Edit
                </button>
                <button class="btn-icon btn-delete" (click)="deleteEmployee(employee.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .employee-list-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .employee-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    h2 {
      margin: 0;
      color: #333;
    }
    .search-filters {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .search-filters form {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-end;
    }
    .form-group {
      flex: 1;
      min-width: 200px;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:hover {
      background-color: #0069d9;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    .btn-outline-secondary {
      background-color: transparent;
      border: 1px solid #6c757d;
      color: #6c757d;
    }
    .btn-outline-secondary:hover {
      background-color: #6c757d;
      color: white;
    }
    .table-container {
      overflow-x: auto;
    }
    .employee-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .employee-table th, .employee-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .employee-table th {
      background-color: #f2f2f2;
      font-weight: 600;
    }
    .employee-table tr:hover {
      background-color: #f9f9f9;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-view {
      background-color: #17a2b8;
      color: white;
    }
    .btn-edit {
      background-color: #ffc107;
      color: #212529;
    }
    .btn-delete {
      background-color: #dc3545;
      color: white;
    }
    .text-center {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      margin: 1rem auto;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  searchForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      department: [''],
      designation: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    const { department, designation } = this.searchForm.value;
    
    if (!department && !designation) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(department, designation)
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching employees:', error);
          this.loading = false;
        }
      });
  }

  resetSearch(): void {
    this.searchForm.reset({
      department: '',
      designation: ''
    });
    this.loadEmployees();
  }

  deleteEmployee(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== id);
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          }
        });
    }
  }
}