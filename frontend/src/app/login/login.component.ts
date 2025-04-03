import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="login()">
      <label>
        Username:
        <input [(ngModel)]="username" name="username" required />
      </label>
      <br />
      <label>
        Password:
        <input [(ngModel)]="password" type="password" name="password" required />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
    <p *ngIf="errorMessage">{{ errorMessage }}</p>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private apollo: Apollo, private router: Router) {}

  login() {
    this.apollo
      .watchQuery<any>({
        query: LOGIN_QUERY,
        variables: {
          username: this.username,
          password: this.password,
        },
      })
      .valueChanges.subscribe(
        ({ data }) => {
          const token = data.login.token;
          localStorage.setItem('token', token);
          // Navigate to the employee management page upon successful login
          this.router.navigate(['/employees']);
        },
        (error) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Error logging in', error);
        }
      );
  }
}
