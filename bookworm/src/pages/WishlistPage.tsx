import React from 'react';
import { BOOKS } from '../data/books';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Book } from '../types';

interface Props {
  onOpenBook: (book: Book) => void;
}

const WishlistPage: React.FC<Props> = ({ onOpenBook }) => {
  const { currentUser } = useAuth();
  const wishlisted = BOOKS.filter(b => currentUser?.wishlist.includes(b.id));

  if (!wishlisted.length) {
    return (
      <div className="page-empty">
        <p className="page-empty-icon">\U0001f90d</p>
        <h2 className="page-empty-title">Your wishlist is empty</h2>
        <p className="page-empty-text">Browse books and tap \U0001f90d to save them here.</p>
      </div>
    );
  }

  return (
    <div className="page-scroll">
      <h1 className="page-heading">My Wishlist</h1>
      <p className="page-sub">{wishlisted.length} saved book{wishlisted.length !== 1 ? 's' : ''}</p>
      <div className="cards-grid">
        {wishlisted.map(b => (
          <BookCard key={b.id} book={b} onOpen={onOpenBook} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
