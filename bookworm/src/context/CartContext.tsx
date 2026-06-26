import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Book } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, qty?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQty: (bookId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.book.id === book.id);
      if (existing) {
        return prev.map(i =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { book, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setItems(prev => prev.filter(i => i.book.id !== bookId));
  }, []);

  const updateQty = useCallback((bookId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.book.id !== bookId));
    } else {
      setItems(prev =>
        prev.map(i => (i.book.id === bookId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.book.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
