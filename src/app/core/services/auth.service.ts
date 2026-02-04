import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse, User, RegisterRequest } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  // Initialize authentication state
  private initializeAuth(): void {
    const user = this.storage.getUser();
    const token = this.storage.getToken();

    if (user && token) {
      this.currentUserSubject.next(user);
      this.isAuthenticated$.next(true);
    }
  }

  // Login user
  login(credentials: LoginRequest): Observable<User> {
    return this.api.post<LoginResponse>('auth/login', credentials)
      .pipe(
        tap(response => {
          // Store token and user data
          this.storage.setToken(response.token);
          this.storage.setUser(response.user);
          
          // Update observables
          this.currentUserSubject.next(response.user);
          this.isAuthenticated$.next(true);
        }),
        map(response => response.user)
      );
  }

  // Register new user
  register(userData: RegisterRequest): Observable<User> {
    return this.api.post<User>('auth/register', userData)
      .pipe(
        tap(user => {
          // You might want to auto-login after registration
          console.log('Registration successful:', user);
        })
      );
  }

  // Logout user
  logout(): void {
    // Call logout API if needed
    this.api.post('auth/logout', {}).subscribe({
      next: () => console.log('Logged out successfully'),
      error: (err) => console.warn('Logout API error:', err)
    });

    // Clear local storage
    this.storage.clearAuth();
    
    // Update observables
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    
    // Redirect to login
    this.router.navigate(['/auth/login']);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticated$.value;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Refresh token
  refreshToken(): Observable<string> {
    const refreshToken = this.storage.getToken(); // In real app, store refresh token separately
    return this.api.post<{ token: string }>('auth/refresh', { refreshToken })
      .pipe(
        tap(response => {
          this.storage.setToken(response.token);
        }),
        map(response => response.token)
      );
  }

  // Mock login for development (remove in production)
  mockLogin(): void {
    const mockUser: User = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      permissions: ['read', 'write', 'delete'],
      createdAt: new Date(),
      isActive: true
    };

    this.storage.setToken('mock-jwt-token');
    this.storage.setUser(mockUser);
    this.currentUserSubject.next(mockUser);
    this.isAuthenticated$.next(true);
    
    this.router.navigate(['/dashboard']);
  }

  // Mock regular user login
  mockUserLogin(): void {
    const mockUser: User = {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      permissions: ['read'],
      createdAt: new Date(),
      isActive: true
    };

    this.storage.setToken('mock-jwt-token-user');
    this.storage.setUser(mockUser);
    this.currentUserSubject.next(mockUser);
    this.isAuthenticated$.next(true);
    
    this.router.navigate(['/dashboard']);
  }
}