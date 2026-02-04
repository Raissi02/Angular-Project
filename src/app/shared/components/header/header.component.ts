import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  appName = environment.appName;
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // For now, set mock data. We'll implement real auth in Phase 2
    this.mockUserData();
  }

  private mockUserData(): void {
    // Mock data for testing UI
    this.isLoggedIn = true;
    this.isAdmin = true;
    this.currentUser = {
      username: 'john.doe',
      email: 'john@example.com',
      role: 'admin'
    };
  }

  logout(): void {
    // Will implement real logout in Phase 2
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.currentUser = null;
    this.router.navigate(['/auth/login']);
  }
}