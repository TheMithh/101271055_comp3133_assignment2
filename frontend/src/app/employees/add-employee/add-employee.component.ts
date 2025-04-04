import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="add-employee-container">
      <div class="form-card">
        <div class="card-header">
          <h2>Add New Employee</h2>
          <button type="button" class="btn btn-outline" routerLink="/employees">Back to List</button>
        </div>
        
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input 
                type="text" 
                id="first_name" 
                formControlName="first_name" 
                class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['first_name'].errors }"
              >
              <div *ngIf="submitted && f['first_name'].errors" class="invalid-feedback">
                <div *ngIf="f['first_name'].errors['required']">First name is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input 
                type="text" 
                id="last_name" 
                formControlName="last_name" 
                class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['last_name'].errors }"
              >
              <div *ngIf="submitted && f['last_name'].errors" class="invalid-feedback">
                <div *ngIf="f['last_name'].errors['required']">Last name is required</div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
            >
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="gender">Gender</label>
              <select 
                id="gender" 
                formControlName="gender" 
                class="form-select" 
                [ngClass]="{ 'is-invalid': submitted && f['gender'].errors }"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div *ngIf="submitted && f['gender'].errors" class="invalid-feedback">
                <div *ngIf="f['gender'].errors['required']">Gender is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="date_of_joining">Date of Joining</label>
              <input 
                type="date" 
                id="date_of_joining" 
                formControlName="date_of_joining" 
                class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['date_of_joining'].errors }"
              >
              <div *ngIf="submitted && f['date_of_joining'].errors" class="invalid-feedback">
                <div *ngIf="f['date_of_joining'].errors['required']">Date of joining is required</div>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <select 
                id="department" 
                formControlName="department" 
                class="form-select" 
                [ngClass]="{ 'is-invalid': submitted && f['department'].errors }"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
              </select>
              <div *ngIf="submitted && f['department'].errors" class="invalid-feedback">
                <div *ngIf="f['department'].errors['required']">Department is required</div>
              </div>
            </div>
            
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
          
          <div class="form-group">
            <label for="employee_photo">Employee Photo URL (Optional)</label>
            <input 
              type="text" 
              id="employee_photo" 
              formControlName="employee_photo" 
              class="form-control"
            >
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
              Add Employee
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/employees">Cancel</button>
          </div>
          
          <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-employee-container {
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
    .form-control, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-control:focus, .form-select:focus {
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
      margin-top: 1rem;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .mt-3 {
      margin-top: 1rem;
    }
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
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
  `]
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      employee_photo: ['']
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.employeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    const newEmployee: Employee = this.employeeForm.value;

    if (newEmployee.date_of_joining) {
      try {
        // Convert to ISO string format
        const date = new Date(newEmployee.date_of_joining);
        if (!isNaN(date.getTime())) {
          newEmployee.date_of_joining = date.toISOString();
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }
    
    this.loading = true;
    this.employeeService.addEmployee(newEmployee)
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: error => {
          this.error = error.message || 'Failed to add employee. Please try again.';
          this.loading = false;
        }
      });
  }
}