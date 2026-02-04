import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.role === 'admin') {
          return true;
        }
        
        // Not admin, redirect to dashboard or show access denied
        if (user) {
          // Regular user, redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Not logged in, redirect to login
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
        
        return false;
      })
    );
  }
}