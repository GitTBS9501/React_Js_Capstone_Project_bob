import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

type PayMethod = 'credit' | 'debit' | 'upi' | 'wallet';

interface Props {
  grandTotal: number;
  address: string;
  onBack: () => void;
  onHome: () => void;
}

const PaymentPage: React.FC<Props> = ({ grandTotal, address, onBack, onHome }) => {
  const { items, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { placeOrder } = useOrders();

  const [method, setMethod] = useState<PayMethod>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [upiId, setUpiId] = useState('');
  const [wallet, setWallet] = useState('Paytm');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);

  const handleCardNumber = (v: string) => {
    const raw = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(raw.replace(/(.{4})/g, '$1-').replace(/-$/, ''));
  };

  const handleExpiry = (v: string) => {
    const raw = v.replace(/\D/g, '').slice(0, 6);
    if (raw.length <= 2) setExpiry(raw);
    else setExpiry(raw.slice(0, 2) + '/' + raw.slice(2));
  };

  const handlePay = () => {
    if (!currentUser || items.length === 0) return;
    setPaying(true);
    setTimeout(() => {
      const snapshot = [...items];
      const orderItems = snapshot.map(i => ({ book: i.book, quantity: i.quantity, priceAtPurchase: i.book.price }));
      placeOrder(currentUser.id, orderItems, address);
      clearCart();
      setPurchasedItems(snapshot);
      setPaying(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return (
      <div className="payment-bg">
        <BgIllustration />
        <div className="payment-success-overlay">
          <div className="payment-success-card">
            <div className="payment-check-circle">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14.5L11.5 20L22 9" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="payment-success-headline">Your purchase of the<br />following reads is successful</p>
            <div className="payment-books-row">
              {purchasedItems.map(({ book }) => (
                <div key={book.id} className="payment-book-item">
                  <div className="payment-book-cover" style={{ background: book.coverColor, color: book.coverTextColor }}>
                    <div className="payment-book-cover-title">{book.title.toUpperCase()}</div>
                    <div className="payment-book-cover-author">{book.author.toUpperCase()}</div>
                  </div>
                  <div className="payment-book-info">
                    <p className="payment-book-info-title">{book.title}</p>
                    <p className="payment-book-info-by">by <span className="payment-book-info-author-link">{book.author}</span></p>
                    <p className="payment-book-info-desc">{book.description}</p>
                    <p className="payment-book-info-format">{book.format}</p>
                    <div className="payment-book-info-tags">
                      {book.tags.map(t => <span key={t} className="payment-book-info-tag">{t}</span>)}
                    </div>
                    <p className="payment-book-info-price">\u20b9{book.price}</p>
                    <p className="payment-book-info-delivery">Delivery by <strong>{book.deliveryDate}</strong></p>
                  </div>
                </div>
              ))}
            </div>
            <button className="payment-continue-btn" onClick={onHome}>
              Continue your Shopping
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px', flexShrink: 0 }}>
                <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".9" />
                <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".9" />
                <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".9" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const methodLabels: { key: PayMethod; label: string }[] = [
    { key: 'credit', label: 'Credit Card' },
    { key: 'debit',  label: 'Debit card' },
    { key: 'upi',    label: 'UPI' },
    { key: 'wallet', label: 'Wallet' },
  ];

  return (
    <div className="payment-bg">
      <BgIllustration />
      <div className="payment-modal-wrap">
        <div className="payment-modal">
          <div className="payment-modal-header">
            <span className="payment-modal-title">Complete Payment</span>
            <span className="payment-payable-amt">Payable Amount: \u20b9{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="payment-modal-body">
            <div className="payment-tabs">
              {methodLabels.map(m => (
                <button key={m.key} className={`payment-tab${method === m.key ? ' active' : ''}`}
                  onClick={() => setMethod(m.key)}>{m.label}</button>
              ))}
            </div>
            <div className="payment-form-area">
              {(method === 'credit' || method === 'debit') && (
                <div className="payment-form-grid">
                  <div className="payment-field-col">
                    <label className="payment-field-label">Card Number</label>
                    <input className="payment-input" placeholder="XXXX-XXXX-XXXX-XXXX" value={cardNumber}
                      onChange={e => handleCardNumber(e.target.value)} maxLength={19} />
                  </div>
                  <div className="payment-field-col">
                    <label className="payment-field-label">Name on Card</label>
                    <input className="payment-input" placeholder="Name" value={cardName} onChange={e => setCardName(e.target.value)} />
                  </div>
                  <div className="payment-field-col">
                    <label className="payment-field-label">CVV</label>
                    <input className="payment-input" placeholder="XXX" value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} type="password" />
                  </div>
                  <div className="payment-field-col">
                    <label className="payment-field-label">Date of Expiry</label>
                    <input className="payment-input" placeholder="MM/YYYY" value={expiry}
                      onChange={e => handleExpiry(e.target.value)} maxLength={7} />
                  </div>
                </div>
              )}
              {method === 'upi' && (
                <div className="payment-single-field">
                  <label className="payment-field-label">UPI ID</label>
                  <input className="payment-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  <p className="payment-upi-note">Enter your registered UPI ID (e.g. 9876543210@upi)</p>
                </div>
              )}
              {method === 'wallet' && (
                <div className="payment-single-field">
                  <label className="payment-field-label">Select Wallet</label>
                  <div className="payment-wallet-grid">
                    {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map(w => (
                      <button key={w} className={`payment-wallet-btn${wallet === w ? ' active' : ''}`}
                        onClick={() => setWallet(w)}>{w}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="payment-pay-row">
                <button className="payment-pay-btn" style={{ opacity: paying ? 0.7 : 1 }}
                  onClick={handlePay} disabled={paying}>
                  {paying ? 'Processing\u2026' : 'Pay Now'}
                  {!paying && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ marginLeft: '8px', flexShrink: 0 }}>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button className="payment-back-link" onClick={onBack}>\u2190 Back to Cart</button>
        </div>
      </div>
    </div>
  );
};

const BgIllustration: React.FC = () => (
  <div className="payment-bg-canvas">
    <div className="payment-book-stack" style={{ top: '8%', right: '6%' }}>
      <div style={{ width: 60, height: 130, background: '#1a6b7a', borderRadius: '4px 8px 8px 4px', position: 'relative' }} />
      <div style={{ position: 'absolute', width: 10, height: 130, background: '#0d4a55', left: 0, top: 0, borderRadius: '3px 0 0 3px' }} />
    </div>
    <div className="payment-book-stack" style={{ top: '22%', left: '10%', transform: 'rotate(-18deg)' }}>
      <div style={{ width: 120, height: 155, background: '#c4651a', borderRadius: '4px 10px 10px 4px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '60%', height: '25%', background: '#a03a12', borderRadius: '3px' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 8, height: '100%', background: '#8b3010', borderRadius: '4px 0 0 4px' }} />
        <div style={{ position: 'absolute', right: -6, top: 6, width: 8, height: '90%', background: '#f5f0e8', borderRadius: '0 3px 3px 0' }} />
      </div>
    </div>
    <div className="payment-book-stack" style={{ bottom: '10%', left: '6%' }}>
      {[{ w: 100, h: 16, bg: '#c4651a', r: '4px 4px 0 0' },
        { w: 110, h: 16, bg: '#2ea0b0', r: '0' },
        { w: 95,  h: 16, bg: '#1a6b7a', r: '0' },
        { w: 115, h: 16, bg: '#e07820', r: '0 0 4px 4px' },
      ].map((b, i) => (
        <div key={i} style={{ width: b.w, height: b.h, background: b.bg, borderRadius: b.r, flexShrink: 0 }} />
      ))}
    </div>
    <div className="payment-book-stack" style={{ bottom: '8%', right: '8%', flexDirection: 'row', gap: 0 }}>
      <div style={{ width: 110, height: 75, background: '#f5efe0', borderRadius: '6px 0 0 6px', transform: 'perspective(200px) rotateY(12deg)', boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.15)' }} />
      <div style={{ width: 110, height: 75, background: '#f0e8d8', borderRadius: '0 6px 6px 0', transform: 'perspective(200px) rotateY(-12deg)', boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.1)' }} />
    </div>
  </div>
);

export default PaymentPage;
