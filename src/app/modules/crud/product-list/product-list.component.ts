import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Table data
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['name', 'sku', 'category', 'price', 'quantity', 'status', 'actions'];
  showColumns = {
    sku: true,
    category: true,
    status: true
  };

  // Filters
  searchTerm = '';
  selectedCategoryId?: number;
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  categories: Category[] = [];

  // Pagination
  pageSize = 10;
  currentPage = 1;
  pagination: any;

  // Stats
  stats: any = {};

  // Loading state
  isLoading = false;
  hasFilters = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.productService.getProducts(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.selectedCategoryId
    ).subscribe({
      next: (response) => {
        this.products = Array.isArray(response.data) ? response.data : [];
        this.dataSource.data = this.products;
        this.pagination = response.pagination;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Failed to load products', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories(true).subscribe({
      next: (response) => {
        this.categories = Array.isArray(response.data) ? response.data : [];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadStats(): void {
    this.productService.getProductStats().subscribe({
      next: (response) => {
        this.stats = response.data;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.hasFilters = !!this.searchTerm || !!this.selectedCategoryId || this.statusFilter !== 'all';
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = undefined;
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.hasFilters = false;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadProducts();
        this.loadStats();
        this.loadCategories();
      }
    });
  }

  toggleProductStatus(product: Product): void {
    const newStatus = !product.isActive;
    
    this.productService.updateProduct(product.id, { isActive: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`, 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadProducts();
        this.loadStats();
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to update product status', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadProducts();
          this.loadStats();
          this.loadCategories();
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Failed to delete product', 'Dismiss', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  toggleColumn(column: keyof typeof this.showColumns): void {
    this.showColumns[column] = !this.showColumns[column];
    this.updateDisplayedColumns();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = ['name'];
    
    if (this.showColumns.sku) this.displayedColumns.push('sku');
    if (this.showColumns.category) this.displayedColumns.push('category');
    
    this.displayedColumns.push('price', 'quantity');
    
    if (this.showColumns.status) this.displayedColumns.push('status');
    
    this.displayedColumns.push('actions');
  }

  getCategoryColor(categoryId: number): string {
    const colors = ['primary', 'accent', 'warn'];
    return colors[categoryId % colors.length];
  }

  getQuantityClass(quantity: number): string {
    if (quantity === 0) return 'quantity-out';
    if (quantity <= 10) return 'quantity-low';
    return 'quantity-ok';
  }

  exportToCSV(): void {
    // Simple CSV export implementation
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Quantity', 'Status'];
    const csvData = this.products.map(p => [
      p.name,
      p.sku,
      p.category?.name || '',
      p.price.toString(),
      p.quantity.toString(),
      p.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('CSV exported successfully', 'Dismiss', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}