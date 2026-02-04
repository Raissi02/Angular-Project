import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  appName = environment.appName;
  currentYear = new Date().getFullYear();
  appVersion = environment.appVersion;
  angularVersion = '15+'; // You can get this dynamically if needed
  buildDate = new Date();
  apiConnected = false;
  isAdmin = true; // Mock for now

  constructor() {}

  ngOnInit(): void {
    // Check API connection (mock for now)
    this.checkApiConnection();
  }

  private checkApiConnection(): void {
    // Will implement real API check in Phase 2
    // For now, simulate connection check
    setTimeout(() => {
      this.apiConnected = true;
    }, 1000);
  }
}