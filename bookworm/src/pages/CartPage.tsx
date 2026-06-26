import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentInfo } from '../App';

interface Props {
  onBack: () => void;
  onGoToPayment: (info: PaymentInfo) => void;
}

const TAX_RATE = 0.12;
const COUPON_DISCOUNT = 100;

const CartPage: React.FC<Props> = ({ onBack, onGoToPayment }) => {
  const { items, updateQty, removeFromCart } = useCart();
  const { currentUser } = useAuth();

  const [useSaved, setUseSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: currentUser?.name.split(' ')[0] ?? '',
    lastName: currentUser?.name.split(' ').slice(1).join(' ') ?? '',
    address: '',
    email: currentUser?.email ?? '',
    city: '',
    pin: '',
    phone: '',
    state: '',
    country: 'India',
    countryCode: '+91',
  });
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const setField = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const subtotal = items.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const discount = couponApplied ? COUPON_DISCOUNT : 0;
  const grandTotal = subtotal + tax - discount;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'BOOKWORM') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try: BOOKWORM');
    }
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) { alert('Your cart is empty.'); return; }
    const fullAddress = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} \u2013 ${form.pin}, ${form.country}`;
    onGoToPayment({ grandTotal, address: fullAddress });
  };

  return (
    <div className="cart-page">
      <div className="cart-breadcrumb">
        <button className="cart-crumb-btn" onClick={onBack}>Home</button>
        <span className="cart-crumb-arrow">/</span>
        <button className="cart-crumb-btn" onClick={onBack}>Browse</button>
        <span className="cart-crumb-arrow">/</span>
        <button className="cart-crumb-btn" onClick={onBack}>Self Help</button>
        <span className="cart-crumb-arrow">/</span>
        <button className="cart-crumb-btn" onClick={onBack}>Joy of Minimalism</button>
        <span className="cart-crumb-arrow">/</span>
        <span className="cart-crumb-current">Shopping Cart</span>
      </div>

      <h1 className="cart-page-title">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>\ud83d\uded2</p>
          <p style={{ color: '#8b949e', fontSize: '15px' }}>Your cart is empty.</p>
          <button className="cart-go-home-btn" onClick={onBack}>Browse Books \u2192</button>
        </div>
      ) : (
        <div className="cart-grid">
          {items.map(item => {
            const { book, quantity } = item;
            return (
              <div key={book.id} className="cart-item">
                <div className="cart-item-cover" style={{ background: book.coverColor, color: book.coverTextColor }}>
                  <div className="cart-item-cover-title">{book.title.toUpperCase()}</div>
                  <div className="cart-item-cover-author">{book.author.toUpperCase()}</div>
                  <div className="cart-item-cover-sub">Simplify your life for greater clarity and happiness</div>
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top-row">
                    <p className="cart-item-title">{book.title}</p>
                    <button className="cart-item-remove-btn" onClick={() => removeFromCart(book.id)} title="Remove">\u2715</button>
                  </div>
                  <p className="cart-item-author">by <span className="cart-item-author-link">{book.author}</span></p>
                  <p className="cart-item-desc">{book.description}</p>
                  <p className="cart-item-format">{book.format}</p>
                  <div className="cart-item-tags">
                    {book.tags.map(t => <span key={t} className="cart-item-tag">{t}</span>)}
                  </div>
                  <p className="cart-item-price">\u20b9{book.price}</p>
                  <p className="cart-item-delivery">Delivery by <strong>{book.deliveryDate}</strong></p>
                  <div className="cart-qty-row">
                    <span className="cart-qty-num">{quantity}</span>
                    <button className="cart-qty-btn" onClick={() => updateQty(book.id, quantity - 1)}>\u2212</button>
                    <button className="cart-qty-btn" onClick={() => updateQty(book.id, quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="cart-bottom-row">
          <div className="cart-address-card">
            <h2 className="cart-card-title">Address</h2>
            <label className="cart-checkbox-row">
              <input type="checkbox" checked={useSaved} onChange={e => setUseSaved(e.target.checked)} style={{ accentColor: '#4f8ef7' }} />
              <span className="cart-check-label">Use Saved Address</span>
            </label>
            <div className="cart-form-grid">
              <div className="cart-field-group">
                <label className="cart-field-label">First Name</label>
                <input className="cart-input" placeholder="First Name" value={form.firstName} onChange={e => setField('firstName', e.target.value)} />
              </div>
              <div className="cart-field-group">
                <label className="cart-field-label">Last Name</label>
                <input className="cart-input" placeholder="Last Name" value={form.lastName} onChange={e => setField('lastName', e.target.value)} />
              </div>
              <div className="cart-field-group cart-field-group-full">
                <label className="cart-field-label">Address</label>
                <input className="cart-input" placeholder="Address Line 2" value={form.address} onChange={e => setField('address', e.target.value)} />
              </div>
              <div className="cart-field-group cart-field-group-full">
                <label className="cart-field-label">e-mail</label>
                <input className="cart-input" placeholder="e-mail" type="email" value={form.email} onChange={e => setField('email', e.target.value)} />
              </div>
              <div className="cart-field-group">
                <label className="cart-field-label">City</label>
                <input className="cart-input" placeholder="City" value={form.city} onChange={e => setField('city', e.target.value)} />
              </div>
              <div className="cart-field-group">
                <label className="cart-field-label">Pin</label>
                <input className="cart-input" placeholder="000000" value={form.pin} onChange={e => setField('pin', e.target.value)} />
              </div>
              <div className="cart-field-group cart-field-group-full">
                <label className="cart-field-label">Phone Number</label>
                <div className="cart-phone-row">
                  <select className="cart-input cart-phone-code" value={form.countryCode} onChange={e => setField('countryCode', e.target.value)}>
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                  </select>
                  <input className="cart-input" style={{ flex: 1 }} placeholder="12345567890" value={form.phone} onChange={e => setField('phone', e.target.value)} />
                </div>
              </div>
              <div className="cart-field-group">
                <label className="cart-field-label">State</label>
                <input className="cart-input" placeholder="State" value={form.state} onChange={e => setField('state', e.target.value)} />
              </div>
              <div className="cart-field-group">
                <label className="cart-field-label">Country</label>
                <select className="cart-input" value={form.country} onChange={e => setField('country', e.target.value)}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="cart-total-card">
            <div className="cart-total-illustration">
              <div className="cart-illustration-bg">
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '14px', background: '#f0a500', borderRadius: '3px', opacity: 0.9 }} />
                  <div style={{ width: '90px', height: '14px', background: '#4f8ef7', borderRadius: '3px', opacity: 0.9 }} />
                  <div style={{ width: '70px', height: '14px', background: '#2ea043', borderRadius: '3px', opacity: 0.9 }} />
                  <div style={{ width: '95px', height: '14px', background: '#e3342f', borderRadius: '3px', opacity: 0.85 }} />
                </div>
              </div>
            </div>
            <div className="cart-total-details">
              <h2 className="cart-card-title">Grand Total</h2>
              <div className="cart-total-row">
                <span className="cart-total-label">Price ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                <span className="cart-total-val">\u20b9{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Tax</span>
                <span className="cart-total-val">\u20b9{tax.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Delivery Charges</span>
                <span className="cart-total-free">Free</span>
              </div>
              <div className="cart-coupon-row">
                <input className="cart-coupon-input" placeholder="Apply Coupon" value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                <button className="cart-apply-btn" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponApplied && <p className="cart-coupon-success">\u2713 Coupon applied \u2014 \u20b9{COUPON_DISCOUNT} off</p>}
              <div className="cart-total-row">
                <span className="cart-total-label">Discount</span>
                <span className="cart-total-val">\u20b9{discount.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="cart-divider-line" />
              <div className="cart-total-row">
                <span className="cart-grand-label">Total Amount</span>
                <span className="cart-grand-val">\u20b9{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <button className="cart-pay-btn" onClick={handleProceedToPayment}>
                Proceed to Payment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
