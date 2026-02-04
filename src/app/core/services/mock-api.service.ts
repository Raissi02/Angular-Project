import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      createdAt: new Date(),
      isActive: true
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      permissions: ['read'],
      createdAt: new Date(),
      isActive: true
    }
  ];

  // Mock login
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const user = this.mockUsers.find(u => 
      u.username === credentials.username && 
      credentials.password === 'password' // Simple check
    );

    if (user) {
      const response: LoginResponse = {
        token: 'mock-jwt-token-' + user.id,
        refreshToken: 'mock-refresh-token-' + user.id,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        user: user
      };

      return of({
        success: true,
        message: 'Login successful',
        data: response
      }).pipe(delay(1000)); // Simulate network delay
    }

    return of({
      success: false,
      message: 'Invalid credentials',
      data: null as any
    }).pipe(delay(1000));
  }

  // Mock register
  register(userData: any): Observable<ApiResponse<User>> {
    const newUser: User = {
      id: this.mockUsers.length + 1,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      permissions: ['read'],
      createdAt: new Date(),
      isActive: true
    };

    this.mockUsers.push(newUser);

    return of({
      success: true,
      message: 'Registration successful',
      data: newUser
    }).pipe(delay(1000));
  }

  // Mock logout
  logout(): Observable<ApiResponse<any>> {
    return of({
      success: true,
      message: 'Logout successful',
      data: null
    }).pipe(delay(500));
  }

  // Mock refresh token
  refreshToken(refreshToken: string): Observable<ApiResponse<{ token: string }>> {
    return of({
      success: true,
      message: 'Token refreshed',
      data: { token: 'new-mock-jwt-token' }
    }).pipe(delay(500));
  }

  // Mock user data
  getUsers(): Observable<ApiResponse<User[]>> {
    return of({
      success: true,
      message: 'Users retrieved',
      data: this.mockUsers
    }).pipe(delay(800));
  }
}