import React, { useState } from 'react';
import { Book } from '../types';
import { BOOKS } from '../data/books';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'John Smith',
    text: 'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
    rating: 4,
  },
];

interface Props {
  book: Book;
  onBack: () => void;
  onOpenBook: (book: Book) => void;
  onGoToCart: () => void;
}

const StarRating: React.FC<{ value: number; max?: number; onChange?: (v: number) => void; size?: number }> = ({
  value, max = 5, onChange, size = 16,
}) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} onClick={() => onChange && onChange(i + 1)}
        style={{ fontSize: size, color: i < value ? '#f0a500' : '#3d444d', cursor: onChange ? 'pointer' : 'default', lineHeight: 1 }}>
        \u2605
      </span>
    ))}
  </div>
);

const BookDetailPage: React.FC<Props> = ({ book, onBack, onOpenBook, onGoToCart }) => {
  const { addToCart } = useCart();
  const { currentUser, updateWishlist, followAuthor } = useAuth();

  const [addedCart, setAddedCart] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const isWishlisted = currentUser?.wishlist.includes(book.id) ?? false;
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  const handleAddCart = () => {
    addToCart(book);
    setAddedCart(true);
    setTimeout(() => { setAddedCart(false); onGoToCart(); }, 600);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    const newReview: Review = {
      id: Date.now(), name: currentUser?.name ?? 'Anonymous',
      text: reviewText.trim(), rating: reviewRating || 5,
    };
    setReviews(prev => [...prev, newReview]);
    setReviewText('');
    setReviewRating(0);
  };

  const related = BOOKS.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);
  const crumbCategory = book.category;
  const crumbTag = book.tags[0] ?? '';

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <button className="detail-crumb-btn" onClick={onBack}>Home</button>
        <span className="detail-crumb-sep">/</span>
        <button className="detail-crumb-btn" onClick={onBack}>{crumbCategory}</button>
        <span className="detail-crumb-sep">/</span>
        <span className="detail-crumb-current">{crumbTag || book.title}</span>
      </div>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-covers-row">
            <div className="detail-cover-main" style={{ background: book.coverColor, color: book.coverTextColor }}>
              <div className="detail-cover-main-title">{book.title.toUpperCase()}</div>
              <div className="detail-cover-main-author">{book.author.toUpperCase()}</div>
              {discount > 0 && <div className="detail-cover-disc-badge">-{discount}%</div>}
            </div>
            <div className="detail-cover-back" style={{ background: book.coverColor, color: book.coverTextColor }}>
              <p className="detail-preview-quote">"A refreshing path to clarity in a cluttered world."</p>
              <p className="detail-preview-body">Discover how less can truly be more.</p>
              <p className="detail-preview-body">In <em>{book.title}</em>, {book.author} guides you through practical strategies to declutter your mind, space, and schedule.</p>
              <p className="detail-preview-head">About the Author</p>
              <p className="detail-preview-body">{book.author} is a productivity coach and advocate for intentional living. His work has helped thousands embrace minimalism as a lifestyle for clarity, freedom, and focus.</p>
              <div className="detail-barcode-area">
                <div className="detail-barcode-lines">
                  {Array.from({ length: 28 }, (_, i) => (
                    <div key={i} className="detail-barcode-line" style={{ width: i % 3 === 0 ? '2px' : '1px' }} />
                  ))}
                </div>
                <div className="detail-isbn-text">{book.isbn}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="detail-section-heading">About the writer</h3>
            <div className="detail-writer-card">
              <div className="detail-writer-avatar">{book.author.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <p className="detail-writer-name">{book.author}</p>
                <p className="detail-writer-bio">
                  {book.author} is a writer, minimalist, and productivity coach based in San Francisco.
                  With a passion for intentional living, {book.author} has dedicated his career to
                  helping individuals simplify their lives \u2014 one habit, one space, and one thought at a time.
                  <br /><br />
                  He is the author of <em>{book.title}</em>, an acclaimed guide to decluttering both physically
                  and mentally.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="detail-section-heading">Reviews</h3>
            <div className="detail-review-form">
              <div className="detail-review-form-top">
                <label className="detail-review-label">Leave Your Review</label>
                <span className="detail-review-char-count">{reviewText.length}/100</span>
              </div>
              <textarea className="detail-review-textarea" placeholder="Placeholder text"
                value={reviewText} maxLength={100} onChange={e => setReviewText(e.target.value)} />
              <div className="detail-review-form-bottom">
                <StarRating value={reviewRating} onChange={setReviewRating} size={22} />
                <button className="detail-review-submit-btn" onClick={handleSubmitReview}>Submit &nbsp;\u2192</button>
              </div>
            </div>
            <div className="detail-review-list">
              {reviews.map(r => (
                <div key={r.id} className="detail-review-item">
                  <div><div className="detail-review-avatar">{r.name.charAt(0)}</div></div>
                  <div className="detail-review-right">
                    <p className="detail-reviewer-name">{r.name}</p>
                    <p className="detail-review-text">{r.text}</p>
                    <StarRating value={r.rating} size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-centre">
          <h1 className="detail-book-title">{book.title}</h1>
          <p className="detail-byline">by{' '}
            <button className="detail-author-btn" onClick={() => followAuthor(book.authorId)}>{book.author}</button>
          </p>
          <p className="detail-desc">{book.description}</p>
          <p className="detail-published-by">Published by: <span className="detail-publisher-link">ABC Publishers</span></p>
          <p className="detail-format-label">{book.format}</p>
          <div className="detail-tags-row">
            {book.tags.map(t => <span key={t} className="detail-tag-link">{t}</span>)}
          </div>
          <div className="detail-price-row">
            <span className="detail-price">\u20b9{book.price}</span>
            {book.originalPrice && <span className="detail-orig-price">\u20b9{book.originalPrice}</span>}
          </div>
          <p className="detail-delivery">Delivery by <strong>{book.deliveryDate}</strong></p>
          <div className="detail-cta-row">
            <button className={`detail-add-cart-btn ${addedCart ? 'added' : 'default'}`} onClick={handleAddCart}>
              {addedCart ? '\u2713 Added to Cart' : 'Add to Cart'}
              {!addedCart && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '6px' }}>
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              )}
            </button>
            <button className={`detail-wishlist-btn ${isWishlisted ? 'active' : 'default'}`}
              onClick={() => updateWishlist(book.id)}>
              {isWishlisted ? '\u2764\ufe0f Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
          <div className="detail-meta-strip">
            <div className="detail-meta-item">
              <span className="detail-meta-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
              </span>
              <div><div className="detail-meta-label">Language</div><div className="detail-meta-val">{book.language}</div></div>
            </div>
            <div className="detail-meta-sep" />
            <div className="detail-meta-item">
              <span className="detail-meta-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <div><div className="detail-meta-label">Rating</div><StarRating value={Math.round(book.rating)} size={13} /></div>
            </div>
            <div className="detail-meta-sep" />
            <div className="detail-meta-item">
              <span className="detail-meta-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <div><div className="detail-meta-label">Sells</div><div className="detail-meta-val">{book.reviewCount > 100 ? `${Math.floor(book.reviewCount / 10)} copies sold` : `${book.reviewCount} copies sold`}</div></div>
            </div>
          </div>
        </div>

        <div className="detail-right">
          <h3 className="detail-related-heading">Related Reads</h3>
          <div className="detail-related-list">
            {(related.length === 0 ? BOOKS.filter(b => b.id !== book.id).slice(0, 4) : related).map(rb => (
              <RelatedCard key={rb.id} book={rb} onClick={onOpenBook} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedCard: React.FC<{ book: Book; onClick: (b: Book) => void }> = ({ book, onClick }) => (
  <div className="detail-related-card" onClick={() => onClick(book)}>
    <div className="detail-related-thumb" style={{ background: book.coverColor, color: book.coverTextColor }}>
      <div className="detail-related-thumb-title">{book.title.toUpperCase()}</div>
      <div className="detail-related-thumb-author">{book.author.toUpperCase()}</div>
    </div>
    <div className="detail-related-info">
      <p className="detail-related-title">{book.title}</p>
      <p className="detail-related-author">by <span className="detail-related-author-link">{book.author}</span></p>
      <p className="detail-related-desc">{book.description}</p>
      <p className="detail-related-format">{book.format}</p>
      <div className="detail-related-tags">
        {book.tags.map(t => <span key={t} className="detail-related-tag">{t}</span>)}
      </div>
      <p className="detail-related-price">\u20b9{book.price}</p>
      <p className="detail-related-delivery">Delivery by <strong>{book.deliveryDate}</strong></p>
    </div>
  </div>
);

export default BookDetailPage;
