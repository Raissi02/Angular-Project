import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showTestPage = true;
  isAuthenticated = false;
  currentUser: any = null;
  apiResponse: any = null;

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state
    this.auth.isAuthenticated$.subscribe(state => {
      this.isAuthenticated = state;
    });

    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  mockAdminLogin(): void {
    this.auth.mockLogin();
  }

  mockUserLogin(): void {
    this.auth.mockUserLogin();
  }

  logout(): void {
    this.auth.logout();
  }

  testGetRequest(): void {
    this.api.get<any>('users').subscribe({
      next: (response) => {
        this.apiResponse = { success: true, data: response };
      },
      error: (error) => {
        this.apiResponse = { success: false, error: error.message };
      }
    });
  }

  testPostRequest(): void {
    const testData = { name: 'Test', value: 123 };
    this.api.post<any>('test', testData).subscribe({
      next: (response) => {
        this.apiResponse = { success: true, data: response };
      },
      error: (error) => {
        this.apiResponse = { success: false, error: error.message };
      }
    });
  }

  testErrorRequest(): void {
    // This will trigger error interceptor
    this.api.get<any>('error-test').subscribe({
      next: (response) => {
        this.apiResponse = { success: true, data: response };
      },
      error: (error) => {
        this.apiResponse = { success: false, error: error };
      }
    });
  }

  continueToApp(): void {
    this.showTestPage = false;
  }
}