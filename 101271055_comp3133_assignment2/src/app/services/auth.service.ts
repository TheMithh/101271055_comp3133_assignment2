// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LOGIN_QUERY, SIGNUP_MUTATION } from '../graphql/graphql.queries';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apollo: Apollo, private router: Router) {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.apollo.watchQuery<{ login: AuthResponse }>({
      query: LOGIN_QUERY,
      variables: { username, password }
    })
    .valueChanges
    .pipe(
      map(result => result.data.login),
      tap(response => {
        // Store token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update authentication state
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    })
    .pipe(
      map(result => result.data?.signup as User)
    );
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update authentication state
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Reset Apollo cache
    this.apollo.client.resetStore();
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}