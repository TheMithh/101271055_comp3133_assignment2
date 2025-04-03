import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">
          <h1>Employee Management</h1>
        </div>
        <nav class="main-nav">
          <ul>
            <li *ngIf="isLoggedIn"><a routerLink="/employees">Employees</a></li>
            <li *ngIf="!isLoggedIn"><a routerLink="/login">Login</a></li>
            <li *ngIf="!isLoggedIn"><a routerLink="/signup">Signup</a></li>
            <li *ngIf="isLoggedIn">
              <button class="btn-logout" (click)="logout()">Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>&copy; {{ currentYear }} Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-header {
      background-color: #343a40;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .main-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .main-nav li {
      margin-left: 1.5rem;
    }
    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
      transition: color 0.3s;
    }
    .main-nav a:hover {
      color: #adb5bd;
    }
    .btn-logout {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      transition: color 0.3s;
    }
    .btn-logout:hover {
      color: #adb5bd;
    }
    .app-content {
      flex: 1;
      background-color: #f8f9fa;
    }
    .app-footer {
      background-color: #343a40;
      color: white;
      text-align: center;
      padding: 1rem;
    }
    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        padding: 1rem 0;
      }
      .logo {
        margin-bottom: 1rem;
      }
      .main-nav ul {
        justify-content: center;
      }
      .main-nav li {
        margin: 0 0.75rem;
      }
    }
  `]
})
export class AppComponent {
  isLoggedIn = false;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private apollo: Apollo // Add this to ensure Apollo is injected at the root
  ) {
    this.updateLoginStatus();
  }

  updateLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.updateLoginStatus();
    this.router.navigate(['/login']);
  }
}