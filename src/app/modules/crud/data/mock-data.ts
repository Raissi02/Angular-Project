import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
    productCount: 3
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Apparel and fashion items',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    isActive: true,
    productCount: 2
  },
  {
    id: 3,
    name: 'Books',
    description: 'Physical and digital books',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    isActive: true,
    productCount: 2
  },
  {
    id: 4,
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    isActive: false,
    productCount: 0
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 999.99,
    quantity: 50,
    categoryId: 1,
    category: mockCategories[0],
    sku: 'ELEC-SMART-X',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 199.99,
    quantity: 100,
    categoryId: 1,
    category: mockCategories[0],
    sku: 'ELEC-HEAD-WL',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1499.99,
    quantity: 25,
    categoryId: 1,
    category: mockCategories[0],
    sku: 'ELEC-LAP-PRO',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 4,
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt',
    price: 24.99,
    quantity: 200,
    categoryId: 2,
    category: mockCategories[1],
    sku: 'CLOTH-TS-COT',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 5,
    name: 'Denim Jeans',
    description: 'Classic blue denim jeans',
    price: 59.99,
    quantity: 150,
    categoryId: 2,
    category: mockCategories[1],
    sku: 'CLOTH-JEANS-DN',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    name: 'Angular Development Guide',
    description: 'Complete guide to Angular development',
    price: 39.99,
    quantity: 75,
    categoryId: 3,
    category: mockCategories[2],
    sku: 'BOOK-ANG-GD',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true,
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 7,
    name: '.NET Cookbook',
    description: 'Recipes for .NET development',
    price: 49.99,
    quantity: 60,
    categoryId: 3,
    category: mockCategories[2],
    sku: 'BOOK-DOT-COOK',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    isActive: false,
    imageUrl: 'https://via.placeholder.com/150'
  }
];