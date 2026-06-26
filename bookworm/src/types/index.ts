export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  price: number;
  originalPrice?: number;
  format: 'Paperback' | 'Hardcover' | 'eBook' | 'Audiobook';
  category: string;
  tags: string[];
  coverColor: string;
  coverTextColor: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  deliveryDate: string;
  isbn: string;
  pages?: number;
  language: Exclude<Language, 'All'>;
  isBestseller?: boolean;
  isNewLaunch?: boolean;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  wishlist: string[];
  followedAuthors: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  book: Book;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  deliveredAt?: string;
  address: string;
}

export type Category =
  | 'All'
  | 'Self-help'
  | 'Mystery'
  | 'Romance'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Historical'
  | 'Biography'
  | "Children's"
  | 'Poetry'
  | 'Science';

export type Format = 'All' | 'Paperback' | 'Hardcover' | 'eBook' | 'Audiobook';
export type Language = 'All' | 'English' | 'Hindi' | 'Spanish' | 'French' | 'German';
export type SortBy = 'Relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Newest' | 'Rating';

export interface Filters {
  category: Category;
  format: Format;
  language: Language;
  priceRange: [number, number];
  sortBy: SortBy;
  searchQuery: string;
}
