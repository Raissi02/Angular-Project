import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  { 
    path: 'crud', 
    loadChildren: () => import('./modules/crud/crud.module').then(m => m.CrudModule)
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }