export interface Product {
  // Assumption: core fields
  id: number;
  title: string;
  category: string;
  price: number;

  // Assumption: optional fields
  description?: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: { createdAt: string; updatedAt: string; barcode?: string; qrCode?: string };
  thumbnail?: string;
  images?: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';

export class ProductAPI {
  static list(params?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: SortOrder;
  }) {
    return cy.request<ProductListResponse>({
      method: 'GET',
      url: '/products',
      qs: params
    });
  }

  static getById(id: number) {
    return cy.request<Product>({
      method: 'GET',
      url: `/products/${id}`,
      failOnStatusCode: false
    });
  }

  static search(q: string) {
    return cy.request<ProductListResponse>({
      method: 'GET',
      url: '/products/search',
      qs: {q}
    });
  }

}