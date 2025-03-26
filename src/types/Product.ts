export interface ProductTypes {
    id: number;
    product_name: string;
    barcode: string;
    price: number;
    stock: number;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    deleted_at: string;
  }
  
  export interface ProductApiResponse<T> {
    data: T;
    status: string;
    code: number;
    messages: string;
  }
  