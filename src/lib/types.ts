export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  category: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  isDefault?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  status: OrderStatus;
  orderDate: number; // timestamp
  estimatedDelivery: number; // timestamp
}
