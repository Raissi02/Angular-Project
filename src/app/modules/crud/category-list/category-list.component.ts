import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  isLoading = false;
  
  // Stats
  activeCategoriesCount = 0;
  totalProductsCount = 0;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.isLoading = true;
    
    this.categoryService.getCategories(true).subscribe({
      next: (response) => {
        this.categories = Array.isArray(response.data) ? response.data : [];
        this.activeCategoriesCount = this.categories.filter(c => c.isActive).length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Failed to load categories', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts(1, 1000).subscribe({
      next: (response) => {
        this.products = Array.isArray(response.data) ? response.data : [];
        this.totalProductsCount = this.products.length;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadCategories();
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: { mode: 'edit', category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadCategories();
      }
    });
  }

  toggleCategoryStatus(category: Category): void {
    const newStatus = !category.isActive;
    
    this.categoryService.updateCategory(category.id, { isActive: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`, 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadCategories();
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to update category status', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully', 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCategories();
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to delete category', 'Dismiss', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getCategoryProducts(categoryId: number): Product[] {
    return this.products
      .filter(p => p.categoryId === categoryId)
      .slice(0, 3); // Show only first 3 products
  }

  viewCategoryProducts(categoryId: number): void {
    this.router.navigate(['/crud/products'], {
      queryParams: { categoryId }
    });
  }
}