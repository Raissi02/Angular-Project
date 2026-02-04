import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', productId?: number }
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\-_]+$/)]],
      imageUrl: ['', [Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    if (this.data.mode === 'edit' && this.data.productId) {
      this.loadProduct(this.data.productId);
    } else {
      // Set default values for create mode
      this.productForm.patchValue({
        price: 0,
        quantity: 0
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getCategoriesForDropdown().subscribe({
      next: (categories) => {
        this.categories = categories;
        
        // Set default category if none selected
        if (!this.productForm.get('categoryId')?.value && categories.length > 0) {
          this.productForm.patchValue({ categoryId: categories[0].id });
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        const product = response.data as any;
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          categoryId: product.categoryId,
          sku: product.sku,
          imageUrl: product.imageUrl || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Failed to load product', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.dialogRef.close();
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.value;

    if (this.data.mode === 'create') {
      this.createProduct(formData);
    } else if (this.data.mode === 'edit' && this.data.productId) {
      this.updateProduct(this.data.productId, formData);
    }
  }

  createProduct(productData: any): void {
    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.snackBar.open('Product created successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to create product', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateProduct(id: number, productData: any): void {
    this.productService.updateProduct(id, productData).subscribe({
      next: () => {
        this.snackBar.open('Product updated successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to update product', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
  }
}