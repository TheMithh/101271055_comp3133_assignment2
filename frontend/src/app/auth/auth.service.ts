import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../shared/models/user.model';
import { TokenService } from '../shared/services/token.service';

// Define interface for auth response
export interface AuthResponse {
  token: string;
  user: User;
}

const LOGIN = gql`
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

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private tokenService: TokenService
  ) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.apollo.watchQuery<any>({
      query: LOGIN,
      variables: { username, password }
    })
    .valueChanges
    .pipe(
      map(result => result.data.login),
      tap((response: AuthResponse) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
      }),
      catchError(error => throwError(() => error))
    );
  }

// In auth.service.ts

// In auth.service.ts - update your signup method

signup(username: string, email: string, password: string): Observable<User> {
  return this.apollo.mutate<any>({
    mutation: SIGNUP,
    variables: { username, email, password }
  })
  .pipe(
    map(result => {
      if (result && result.data && result.data.signup) {
        return result.data.signup as User;
      } else {
        throw new Error('No data returned from server');
      }
    }),
    catchError(err => {
      // Make sure to log the complete error for debugging
      console.error('GraphQL Error:', err);
      
      // Simply pass through the error to be handled by the component
      return throwError(() => err);
    })
  );
}

  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getUser(): User | null {
    return this.tokenService.getUser();
  }
}