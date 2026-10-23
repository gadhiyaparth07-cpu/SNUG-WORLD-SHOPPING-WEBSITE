export type ProductCategory = 'all' | 'oversized' | 'graphic' | 'distressed' | 'minimal' | 'new_drops' | 'bestsellers';

export type GarmentSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  tagColor?: string;
  frontImage: string;
  backImage: string;
  availableSizes: GarmentSize[];
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: 'oversized' | 'graphic' | 'distressed' | 'minimal';
  description: string;
  fabric: string;
  fit: string;
  finish: string;
  gsm: number;
  isBestseller?: boolean;
  isNewDrop?: boolean;
  isFeatured?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'limited_run';
  hangerXOffset?: number; // Position offset along the clothing rod (0-100%)
  defaultAngle?: number; // Resting hanging tilt angle in degrees (-8 to 8)
  defaultColorId: string;
  colors: ColorVariant[];
  details: string[];
  careInstructions: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  category: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  size: GarmentSize;
  price: number;
  image: string;
  quantity: number;
}

export interface FilterState {
  category: ProductCategory;
  color: string;
  size: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}
