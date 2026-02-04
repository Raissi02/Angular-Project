import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  isLoading = false;
  mode: 'view' | 'edit' | 'create' = 'view';
  productId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] || 'view';
    this.productId = this.route.snapshot.params['id'];
    
    if (this.mode === 'create') {
      this.initializeCreateMode();
    } else if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  initializeCreateMode(): void {
    // For create mode, we'll use the dialog
    this.openCreateDialog();
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        this.product = response.data as Product;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Product not found', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/crud/products']);
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.router.navigate(['/crud/products']);
      } else {
        this.router.navigate(['/crud/products']);
      }
    });
  }

  openEditDialog(): void {
    if (!this.product) return;

    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { mode: 'edit', productId: this.product.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success' && this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/crud/products']);
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

  toggleProductStatus(): void {
    if (!this.product) return;

    const newStatus = !this.product.isActive;
    
    this.productService.updateProduct(this.product.id, { isActive: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`, 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadProduct(this.product.id);
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to update product status', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getStockStatus(): string {
    if (!this.product) return 'Unknown';
    
    if (this.product.quantity === 0) return 'Out of Stock';
    if (this.product.quantity <= 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusColor(): string {
    if (!this.product) return 'default';
    
    if (this.product.quantity === 0) return 'warn';
    if (this.product.quantity <= 10) return 'accent';
    return 'primary';
  }
}