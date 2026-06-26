import React from 'react';
import { BOOKS } from '../data/books';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Book } from '../types';

interface Props {
  onOpenBook: (book: Book) => void;
}

const MyWritersPage: React.FC<Props> = ({ onOpenBook }) => {
  const { currentUser, followAuthor } = useAuth();
  const followed = currentUser?.followedAuthors ?? [];

  const followedAuthors = Array.from(
    new Set(
      BOOKS.filter(b => followed.includes(b.authorId)).map(b => b.authorId)
    )
  ).map(aid => {
    const book = BOOKS.find(b => b.authorId === aid)!;
    return { id: aid, name: book.author };
  });

  if (followedAuthors.length === 0) {
    return (
      <div className="page-empty">
        <p className="page-empty-icon">\u270d\ufe0f</p>
        <h2 className="page-empty-title">No followed authors</h2>
        <p className="page-empty-text">Open a book and click "+ Follow" on an author to track their work.</p>
      </div>
    );
  }

  return (
    <div className="page-scroll">
      <h1 className="page-heading">My Writers</h1>
      <p className="page-sub">Authors you follow</p>
      {followedAuthors.map(author => {
        const authorBooks = BOOKS.filter(b => b.authorId === author.id);
        return (
          <section key={author.id} className="writers-section">
            <div className="writers-author-row">
              <div className="writers-avatar">{author.name.charAt(0)}</div>
              <div>
                <h2 className="writers-author-name">{author.name}</h2>
                <p className="writers-book-count">{authorBooks.length} book{authorBooks.length !== 1 ? 's' : ''} in catalogue</p>
              </div>
              <button className="writers-unfollow-btn" onClick={() => followAuthor(author.id)}>
                \u2713 Following
              </button>
            </div>
            <div className="cards-grid">
              {authorBooks.map(b => <BookCard key={b.id} book={b} onOpen={onOpenBook} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MyWritersPage;
