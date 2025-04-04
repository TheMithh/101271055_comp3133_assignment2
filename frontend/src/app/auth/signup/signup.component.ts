import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <h2>Sign Up</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control" 
              [ngClass]="{ 'is-invalid': submitted && f['username'].errors }"
            >
            <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
              <div *ngIf="f['username'].errors['required']">Username is required</div>
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
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
            >
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
              <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>
          
          <div class="form-group">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
              Sign Up
            </button>
            <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
            <div *ngIf="success" class="alert alert-success mt-3">Registration successful! <a routerLink="/login">Login</a></div>
          </div>
          
          <div class="text-center mt-3">
            <p>Already have an account? <a routerLink="/login">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .signup-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }
    .form-group {
      margin-bottom: 1rem;
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
    .btn {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
    }
    .btn:hover {
      background: #0069d9;
    }
    .btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    .alert {
      padding: 0.75rem 1.25rem;
      border-radius: 4px;
    }
    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .alert-success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    .text-center {
      text-align: center;
    }
    .mt-3 {
      margin-top: 1rem;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = ''; // Clear previous errors
    this.success = false; // Reset success state
  
    // Stop if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
  
    this.loading = true;
    
    this.authService.signup(
      this.f['username'].value,
      this.f['email'].value,
      this.f['password'].value
    )
    .subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: error => {
        // Extract the error message from the GraphQL error
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          this.error = error.graphQLErrors[0].message;
        } else if (error.message && error.message.includes('Username already taken')) {
          this.error = 'Username already taken';
        } else if (error.message && error.message.includes('Email already in use')) {
          this.error = 'Email already in use';
        } else {
          this.error = 'Registration failed: ' + (error.message || 'Unknown error');
        }
        
        this.success = false; // Ensure success is false
        this.loading = false;
        
        console.error('Signup error:', error);
      }
    });
  }
}