import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  appName = environment.appName;
  appVersion = environment.appVersion;
  currentYear = new Date().getFullYear();
  buildDate = new Date();

  ngOnInit(): void {}
}