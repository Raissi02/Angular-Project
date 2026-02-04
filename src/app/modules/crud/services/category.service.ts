import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Category, CategoryCreateRequest, CategoryUpdateRequest, CategoryResponse } from '../models/category.model';
import { mockCategories } from '../data/mock-data';
import { mockProducts } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = [...mockCategories];
  private products = mockProducts;

  // Get all categories
  getCategories(includeInactive: boolean = false): Observable<CategoryResponse> {
    let filteredCategories = [...this.categories];
    
    if (!includeInactive) {
      filteredCategories = filteredCategories.filter(c => c.isActive);
    }

    // Calculate product counts
    const categoriesWithCounts = filteredCategories.map(category => ({
      ...category,
      productCount: this.products.filter(p => p.categoryId === category.id).length
    }));

    return of({
      success: true,
      message: 'Categories retrieved successfully',
      data: categoriesWithCounts
    }).pipe(delay(300));
  }

  // Get category by ID
  getCategoryById(id: number): Observable<CategoryResponse> {
    const category = this.categories.find(c => c.id === id);
    
    if (category) {
      const categoryWithCount = {
        ...category,
        productCount: this.products.filter(p => p.categoryId === id).length
      };

      return of({
        success: true,
        message: 'Category retrieved successfully',
        data: categoryWithCount
      }).pipe(delay(300));
    }

    return throwError(() => ({
      status: 404,
      message: 'Category not found'
    }));
  }

  // Create new category
  createCategory(categoryData: CategoryCreateRequest): Observable<CategoryResponse> {
    const newCategory: Category = {
      id: this.getNextId(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      productCount: 0
    };

    this.categories.unshift(newCategory);

    return of({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    }).pipe(delay(500));
  }

  // Update category
  updateCategory(id: number, categoryData: CategoryUpdateRequest): Observable<CategoryResponse> {
    const index = this.categories.findIndex(c => c.id === id);
    
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        ...categoryData,
        updatedAt: new Date()
      };

      return of({
        success: true,
        message: 'Category updated successfully',
        data: this.categories[index]
      }).pipe(delay(500));
    }

    return throwError(() => ({
      status: 404,
      message: 'Category not found'
    }));
  }

  // Delete category (soft delete - set inactive)
  deleteCategory(id: number): Observable<CategoryResponse> {
    const index = this.categories.findIndex(c => c.id === id);
    
    if (index !== -1) {
      // Check if category has products
      const productCount = this.products.filter(p => p.categoryId === id).length;
      
      if (productCount > 0) {
        return throwError(() => ({
          status: 400,
          message: `Cannot delete category with ${productCount} products. Reassign products first.`
        }));
      }

      this.categories[index].isActive = false;
      this.categories[index].updatedAt = new Date();

      return of({
        success: true,
        message: 'Category deleted successfully',
        data: this.categories[index]
      }).pipe(delay(500));
    }

    return throwError(() => ({
      status: 404,
      message: 'Category not found'
    }));
  }

  // Get categories for dropdown (active only)
  getCategoriesForDropdown(): Observable<Category[]> {
    const activeCategories = this.categories
      .filter(c => c.isActive)
      .map(c => ({
        id: c.id,
        name: c.name,
        description: c.description
      } as Category));

    return of(activeCategories).pipe(delay(200));
  }

  // Helper method to get next ID
  private getNextId(): number {
    return this.categories.length > 0 
      ? Math.max(...this.categories.map(c => c.id)) + 1 
      : 1;
  }
}