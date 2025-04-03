import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="update-employee-container">
      <div class="form-card">
        <div class="card-header">
          <h2>Update Employee</h2>
          <button type="button" class="btn btn-outline" routerLink="/employees">Back to List</button>
        </div>
        
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading employee data...</p>
        </div>
        
        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <form *ngIf="!loading && employee" [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="designation">Designation</label>
              <input 
                type="text" 
                id="designation" 
                formControlName="designation" 
                class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['designation'].errors }"
              >
              <div *ngIf="submitted && f['designation'].errors" class="invalid-feedback">
                <div *ngIf="f['designation'].errors['required']">Designation is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="salary">Salary</label>
              <input 
                type="number" 
                id="salary" 
                formControlName="salary" 
                class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['salary'].errors }"
              >
              <div *ngIf="submitted && f['salary'].errors" class="invalid-feedback">
                <div *ngIf="f['salary'].errors['required']">Salary is required</div>
                <div *ngIf="f['salary'].errors['min']">Salary must be at least 1000</div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="submitting">
              <span *ngIf="submitting" class="spinner-border spinner-border-sm mr-1"></span>
              Update Employee
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/employees">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .update-employee-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .form-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    h2 {
      margin: 0;
      color: #333;
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
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-row .form-group {
      flex: 1;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .is-invalid {
      border-color: #dc3545;
    }
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
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
    .btn-outline {
      background-color: transparent;
      border: 1px solid #007bff;
      color: #007bff;
    }
    .btn-outline:hover {
      background-color: #007bff;
      color: white;
    }
    .btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
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
    .spinner-border {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 0.2em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border .75s linear infinite;
      margin-right: 0.5rem;
    }
    @keyframes spinner-border {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class UpdateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: Employee | null = null;
  loading = false;
  submitted = false;
  submitting = false;
  error = '';
  employeeId = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.formBuilder.group({
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = id;
      this.employeeService.getEmployeeById(id)
        .subscribe({
          next: (data) => {
            this.employee = data;
            this.employeeForm.patchValue({
              designation: data.designation,
              salary: data.salary
            });
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Failed to load employee data. ' + (error.message || '');
            this.loading = false;
          }
        });
    } else {
      this.error = 'Employee ID is required';
      this.loading = false;
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.employeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }

    this.submitting = true;
    this.employeeService.updateEmployee(
      this.employeeId,
      this.f['salary'].value,
      this.f['designation'].value
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: error => {
        this.error = error.message || 'Failed to update employee. Please try again.';
        this.submitting = false;
      }
    });
  }
}