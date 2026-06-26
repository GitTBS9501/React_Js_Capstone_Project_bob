import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Page } from '../App';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<Props> = ({ activePage, onNavigate, onToggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: 'My Orders',   page: 'orders' },
    { label: 'My Wishlist', page: 'wishlist' },
    { label: 'My Writers',  page: 'writers' },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setNavOpen(false);
  };

  return (
    <header className="header">
      {/* Hamburger — sidebar toggle (shown on ≤1024px) */}
      <button
        className="header-menu-btn"
        onClick={onToggleSidebar}
        title="Browse categories"
        aria-label="Toggle category sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Logo */}
      <div className="header-logo" onClick={() => onNavigate('home')}>
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#4f8ef7" />
          <path d="M7 8h5v12H7zM16 8h5v12h-5z" fill="#fff" opacity=".9" />
          <path d="M12 14h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="header-logo-text">Book Worm</span>
      </div>

      {/* Nav — hidden on ≤768px, shown as dropdown when navOpen */}
      <nav className={`header-nav${navOpen ? ' nav-open' : ''}`}>
        {navItems.map(n => (
          <button
            key={n.page}
            className={`header-nav-btn${activePage === n.page ? ' active' : ''}`}
            onClick={() => handleNavClick(n.page)}
          >
            {n.label}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="header-actions">
        {/* Nav hamburger — shown on ≤768px to open nav dropdown */}
        <button
          className="header-nav-toggle"
          onClick={() => setNavOpen(o => !o)}
          title="Navigation menu"
          aria-label="Toggle navigation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="5"  x2="21" y2="5"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="19" x2="21" y2="19" />
          </svg>
        </button>

        {/* Cart icon */}
        <button
          className={`header-icon-btn${activePage === 'cart' ? ' active' : ''}`}
          onClick={() => { onNavigate('cart'); setNavOpen(false); }}
          title="Shopping Cart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {totalItems > 0 && <span className="header-cart-badge">{totalItems}</span>}
        </button>

        {/* Profile */}
        <div className="header-profile-wrap">
          <button className="header-icon-btn" onClick={() => { setProfileOpen(p => !p); setNavOpen(false); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {profileOpen && (
            <div className="header-dropdown">
              <div className="header-dropdown-header">
                <p className="header-dropdown-name">{currentUser?.name}</p>
                <p className="header-dropdown-email">{currentUser?.email}</p>
              </div>
              <button className="header-dropdown-item"
                onClick={() => { onNavigate('orders'); setProfileOpen(false); }}>
                My Orders
              </button>
              <button className="header-dropdown-item"
                onClick={() => { onNavigate('wishlist'); setProfileOpen(false); }}>
                Wishlist
              </button>
              <hr className="header-dropdown-hr" />
              <button className="header-dropdown-item danger" onClick={logout}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
