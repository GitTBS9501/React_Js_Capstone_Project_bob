import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { Order } from '../types';

const statusColors: Record<string, string> = {
  Processing: '#f0a500',
  Shipped: '#4f8ef7',
  Delivered: '#2ea043',
  Cancelled: '#f85149',
};

const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [buyAgainIds, setBuyAgainIds] = useState<Set<string>>(new Set());

  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  const handleBuyAgain = (order: Order) => {
    order.items.forEach(item => addToCart(item.book, item.quantity));
    setBuyAgainIds(prev => new Set(Array.from(prev).concat(order.id)));
    setTimeout(() => {
      setBuyAgainIds(prev => {
        const next = new Set(Array.from(prev));
        next.delete(order.id);
        return next;
      });
    }, 2500);
  };

  if (myOrders.length === 0) {
    return (
      <div className="page-empty">
        <p className="page-empty-icon">\ud83d\udce6</p>
        <h2 className="page-empty-title">No orders yet</h2>
        <p className="page-empty-text">Your order history will appear here once you make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="page-scroll">
      <h1 className="page-heading">My Orders</h1>
      <p className="page-sub">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''} placed</p>
      <div className="orders-list">
        {myOrders.map(order => {
          const isExpanded = expandedId === order.id;
          const isBoughtAgain = buyAgainIds.has(order.id);
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="order-right">
                  <span className="order-status-badge" style={{
                    background: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                    borderColor: `${statusColors[order.status]}55`,
                  }}>{order.status}</span>
                  <span className="order-total">\u20b9{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="order-items-preview">
                {order.items.slice(0, isExpanded ? 999 : 2).map(item => (
                  <div key={item.book.id} className="order-item">
                    <div className="order-item-thumb" style={{
                      background: item.book.coverColor || '#21262d',
                      color: item.book.coverTextColor || '#fff',
                    }}>
                      <span style={{ fontSize: '7px', fontWeight: 800, textAlign: 'center', padding: '4px' }}>
                        {item.book.title?.substring(0, 12) ?? ''}
                      </span>
                    </div>
                    <div className="order-item-detail">
                      <p className="order-item-title">{item.book.title}</p>
                      <p className="order-item-meta">{item.book.author} \u2022 {item.book.format} \u2022 Qty: {item.quantity}</p>
                      <p className="order-item-price">
                        \u20b9{item.priceAtPurchase} each
                        <span className="order-item-price-sub"> = \u20b9{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                ))}
                {!isExpanded && order.items.length > 2 && (
                  <p className="order-more">+{order.items.length - 2} more item(s)</p>
                )}
              </div>
              {isExpanded && (
                <div className="order-address-box">
                  <span className="order-address-label">\ud83d\udccd Delivered to</span>
                  <span className="order-address-val">{order.address}</span>
                </div>
              )}
              <div className="order-actions">
                <button className="order-detail-btn"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  {isExpanded ? '\u25b2 Less details' : '\u25bc View details'}
                </button>
                <button
                  className={`order-buy-again-btn ${isBoughtAgain ? 'added' : 'default'}`}
                  onClick={() => handleBuyAgain(order)}>
                  {isBoughtAgain ? '\u2713 Added to Cart!' : '\ud83d\uded2 Buy Again'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
