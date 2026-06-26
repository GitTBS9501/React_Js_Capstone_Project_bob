import type { User, Order } from '../types';

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Soumik Das',
    email: 'soumik@bookworm.com',
    password: 'password123',
    wishlist: ['b4', 'b10'],
    followedAuthors: ['a1', 'a4', 'a6'],
  },
  {
    id: 'u2',
    name: 'Priya Singh',
    email: 'priya@bookworm.com',
    password: 'priya2024',
    wishlist: ['b2', 'b9'],
    followedAuthors: ['a2', 'a9'],
  },
];

export const ORDERS: Order[] = [
  {
    id: 'ord-001',
    userId: 'u1',
    items: [
      { book: { id: 'b1' } as any, quantity: 1, priceAtPurchase: 399 },
      { book: { id: 'b3' } as any, quantity: 1, priceAtPurchase: 359 },
    ],
    total: 758,
    status: 'Delivered',
    createdAt: '2024-06-01T10:00:00Z',
    deliveredAt: '2024-06-05T14:00:00Z',
    address: '42, MG Road, Bengaluru, Karnataka – 560001',
  },
  {
    id: 'ord-002',
    userId: 'u1',
    items: [
      { book: { id: 'b4' } as any, quantity: 1, priceAtPurchase: 299 },
    ],
    total: 299,
    status: 'Delivered',
    createdAt: '2024-06-15T09:00:00Z',
    deliveredAt: '2024-06-18T11:00:00Z',
    address: '42, MG Road, Bengaluru, Karnataka – 560001',
  },
  {
    id: 'ord-003',
    userId: 'u1',
    items: [
      { book: { id: 'b6' } as any, quantity: 1, priceAtPurchase: 359 },
      { book: { id: 'b7' } as any, quantity: 2, priceAtPurchase: 149 },
    ],
    total: 657,
    status: 'Shipped',
    createdAt: '2024-07-10T08:30:00Z',
    address: '42, MG Road, Bengaluru, Karnataka – 560001',
  },
];
