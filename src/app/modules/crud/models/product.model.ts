import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: Category;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  imageUrl?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  sku: string;
  imageUrl?: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId?: number;
  sku?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}