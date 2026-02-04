import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductDetailComponent, data: { mode: 'create' } },
  { path: 'products/:id', component: ProductDetailComponent, data: { mode: 'view' } },
  { path: 'products/:id/edit', component: ProductDetailComponent, data: { mode: 'edit' } },
  { path: 'categories', component: CategoryListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudRoutingModule { }