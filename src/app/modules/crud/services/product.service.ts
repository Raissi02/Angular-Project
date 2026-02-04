import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Product, ProductCreateRequest, ProductUpdateRequest, ProductResponse, PaginationInfo } from '../models/product.model';
import { mockProducts } from '../data/mock-data';
import { mockCategories } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [...mockProducts];
  private categories = mockCategories;

  // Get all products with pagination
  getProducts(
    page: number = 1, 
    pageSize: number = 10,
    search: string = '',
    categoryId?: number
  ): Observable<ProductResponse> {
    // Filter products
    let filteredProducts = [...this.products];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }
    
    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Enrich with category data
    const enrichedProducts = paginatedProducts.map(product => ({
      ...product,
      category: this.categories.find(c => c.id === product.categoryId)
    }));

    const pagination: PaginationInfo = {
      page,
      pageSize,
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / pageSize)
    };

    return of({
      success: true,
      message: 'Products retrieved successfully',
      data: enrichedProducts,
      pagination
    }).pipe(delay(500)); // Simulate network delay
  }

  // Get single product by ID
  getProductById(id: number): Observable<ProductResponse> {
    const product = this.products.find(p => p.id === id);
    
    if (product) {
      // Enrich with category
      const enrichedProduct = {
        ...product,
        category: this.categories.find(c => c.id === product.categoryId)
      };

      return of({
        success: true,
        message: 'Product retrieved successfully',
        data: enrichedProduct
      }).pipe(delay(300));
    }

    return throwError(() => ({
      status: 404,
      message: 'Product not found'
    }));
  }

  // Create new product
  createProduct(productData: ProductCreateRequest): Observable<ProductResponse> {
    const newProduct: Product = {
      id: this.getNextId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.products.unshift(newProduct); // Add to beginning
    
    // Update category product count
    const category = this.categories.find(c => c.id === productData.categoryId);
    if (category && category.productCount !== undefined) {
      category.productCount++;
    }

    return of({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    }).pipe(delay(500));
  }

  // Update existing product
  updateProduct(id: number, productData: ProductUpdateRequest): Observable<ProductResponse> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const oldCategoryId = this.products[index].categoryId;
      const newCategoryId = productData.categoryId || oldCategoryId;
      
      // Update product
      this.products[index] = {
        ...this.products[index],
        ...productData,
        updatedAt: new Date()
      };

      // Update category counts if category changed
      if (oldCategoryId !== newCategoryId) {
        const oldCategory = this.categories.find(c => c.id === oldCategoryId);
        const newCategory = this.categories.find(c => c.id === newCategoryId);
        
        if (oldCategory && oldCategory.productCount !== undefined) {
          oldCategory.productCount = Math.max(0, (oldCategory.productCount || 0) - 1);
        }
        
        if (newCategory && newCategory.productCount !== undefined) {
          newCategory.productCount = (newCategory.productCount || 0) + 1;
        }
      }

      return of({
        success: true,
        message: 'Product updated successfully',
        data: this.products[index]
      }).pipe(delay(500));
    }

    return throwError(() => ({
      status: 404,
      message: 'Product not found'
    }));
  }

  // Delete product
  deleteProduct(id: number): Observable<ProductResponse> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const deletedProduct = this.products[index];
      this.products.splice(index, 1);
      
      // Update category product count
      const category = this.categories.find(c => c.id === deletedProduct.categoryId);
      if (category && category.productCount !== undefined) {
        category.productCount = Math.max(0, (category.productCount || 0) - 1);
      }

      return of({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
      }).pipe(delay(500));
    }

    return throwError(() => ({
      status: 404,
      message: 'Product not found'
    }));
  }

  // Get products by category
  getProductsByCategory(categoryId: number): Observable<ProductResponse> {
    const categoryProducts = this.products
      .filter(p => p.categoryId === categoryId)
      .map(product => ({
        ...product,
        category: this.categories.find(c => c.id === product.categoryId)
      }));

    return of({
      success: true,
      message: 'Products retrieved successfully',
      data: categoryProducts
    }).pipe(delay(300));
  }

  // Get product statistics
  getProductStats(): Observable<any> {
    const totalProducts = this.products.length;
    const activeProducts = this.products.filter(p => p.isActive).length;
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const categoriesCount = this.categories.length;

    return of({
      success: true,
      message: 'Statistics retrieved',
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        totalValue,
        averagePrice: totalProducts > 0 ? totalValue / totalProducts : 0,
        categoriesCount
      }
    }).pipe(delay(300));
  }

  // Helper method to get next ID
  private getNextId(): number {
    return this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) + 1 
      : 1;
  }
}