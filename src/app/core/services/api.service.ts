import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, timeout } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, ApiError } from '../../models/auth.models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private defaultTimeout = environment.defaultTimeout;
  private retryAttempts = environment.retryAttempts;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // Generic GET request
  get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      headers: this.getHeaders(),
      params: this.createParams(params)
    };

    return this.http.get<ApiResponse<T>>(url, options)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.retryAttempts),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = { headers: this.getHeaders() };

    return this.http.post<ApiResponse<T>>(url, data, options)
      .pipe(
        timeout(this.defaultTimeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = { headers: this.getHeaders() };

    return this.http.put<ApiResponse<T>>(url, data, options)
      .pipe(
        timeout(this.defaultTimeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = { headers: this.getHeaders() };

    return this.http.delete<ApiResponse<T>>(url, options)
      .pipe(
        timeout(this.defaultTimeout),
        map(response => this.handleResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  // Upload file with progress
  upload<T>(endpoint: string, file: File, data?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    const formData = new FormData();
    
    formData.append('file', file);
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }

    // Remove content-type for FormData (browser will set it with boundary)
    const headers = this.getHeaders().delete('Content-Type');

    return this.http.post(url, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // Private helper methods
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const token = this.storage.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private createParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return httpParams;
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message || 'API request failed');
    }
    return response.data;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError: ApiError = {
      status: error.status,
      message: error.error?.message || error.message,
      errors: error.error?.errors,
      timestamp: new Date()
    };

    // Handle specific error codes
    switch (error.status) {
      case 401:
        // Unauthorized - redirect to login
        this.storage.clearAuth();
        window.location.href = '/auth/login';
        break;
      case 403:
        // Forbidden - show access denied
        console.warn('Access denied:', apiError);
        break;
      case 404:
        // Not found
        console.warn('Resource not found:', apiError);
        break;
      case 500:
        // Server error
        console.error('Server error:', apiError);
        break;
      default:
        console.error('API Error:', apiError);
    }

    return throwError(() => apiError);
  }
}