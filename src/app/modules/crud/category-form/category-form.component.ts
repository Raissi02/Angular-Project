import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', category?: Category }
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.category) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
        description: this.data.category.description
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.categoryForm.value;

    if (this.data.mode === 'create') {
      this.createCategory(formData);
    } else if (this.data.mode === 'edit' && this.data.category) {
      this.updateCategory(this.data.category.id, formData);
    }
  }

  createCategory(categoryData: any): void {
    this.categoryService.createCategory(categoryData).subscribe({
      next: () => {
        this.snackBar.open('Category created successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to create category', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateCategory(id: number, categoryData: any): void {
    this.categoryService.updateCategory(id, categoryData).subscribe({
      next: () => {
        this.snackBar.open('Category updated successfully', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close('success');
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Failed to update category', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}