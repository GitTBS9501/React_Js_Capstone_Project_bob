import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, OrderItem, Book } from '../types';
import { ORDERS } from '../data/users';
import { BOOKS } from '../data/books';

// Hydrate order items with full book objects
const hydrateOrders = (orders: Order[]): Order[] =>
  orders.map(o => ({
    ...o,
    items: o.items.map(item => ({
      ...item,
      book: BOOKS.find(b => b.id === item.book.id) || item.book,
    })),
  }));

interface OrderContextType {
  orders: Order[];
  placeOrder: (userId: string, items: OrderItem[], address: string) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(hydrateOrders(ORDERS));

  const placeOrder = useCallback(
    (userId: string, items: OrderItem[], address: string): Order => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId,
        items,
        total: items.reduce((s, i) => s + i.priceAtPurchase * i.quantity, 0),
        status: 'Processing',
        createdAt: new Date().toISOString(),
        address,
      };
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
