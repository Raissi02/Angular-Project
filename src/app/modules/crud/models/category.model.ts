export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  productCount?: number;
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
}