import React from 'react';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props {
  book: Book;
  onOpen?: (book: Book) => void;
}

const BookCard: React.FC<Props> = ({ book, onOpen }) => {
  const { currentUser, updateWishlist } = useAuth();

  const isWishlisted = currentUser?.wishlist.includes(book.id) ?? false;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateWishlist(book.id);
  };

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="book-card" onClick={() => onOpen && onOpen(book)}>
      {/* Cover */}
      <div
        className="book-card-cover"
        style={{ background: book.coverColor, color: book.coverTextColor }}
      >
        <div className="book-card-cover-inner">
          <div className="book-card-cover-title">{book.title.toUpperCase()}</div>
          <div className="book-card-cover-author">{book.author.toUpperCase()}</div>
        </div>
        {discount > 0 && (
          <div className="book-card-discount-badge">-{discount}%</div>
        )}
        <button className="book-card-wish-btn" onClick={handleWishlist}>
          {isWishlisted ? '\u2764\ufe0f' : '\U0001f90d'}
        </button>
      </div>

      {/* Info */}
      <div className="book-card-info">
        <p className="book-card-title">{book.title}</p>
        <p className="book-card-author">by <span className="book-card-author-link">{book.author}</span></p>
        <p className="book-card-desc">{book.description}</p>
        <p className="book-card-format">{book.format}</p>
        <div className="book-card-tags">
          {book.tags.map(t => (
            <span key={t} className="book-card-tag">{t}</span>
          ))}
        </div>
        <div className="book-card-price-row">
          <span className="book-card-price">₹{book.price}</span>
          {book.originalPrice && (
            <span className="book-card-orig-price">₹{book.originalPrice}</span>
          )}
        </div>
        <p className="book-card-delivery">
          Delivery by <strong>{book.deliveryDate}</strong>
        </p>
      </div>
    </div>
  );
};

export default BookCard;
