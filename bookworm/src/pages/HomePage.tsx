import React, { useState, useMemo } from 'react';
import { BOOKS } from '../data/books';
import { Book, Filters, Format, Language, SortBy } from '../types';
import Sidebar from '../components/Sidebar';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const FORMATS: Format[] = ['All', 'Paperback', 'Hardcover', 'eBook', 'Audiobook'];
const LANGUAGES: Language[] = ['All', 'English', 'Hindi', 'Spanish', 'French', 'German'];
const SORT_OPTIONS: SortBy[] = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Rating'];
const PRICE_MAX = 1000;

interface Props {
  onOpenBook: (book: Book) => void;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}

const HomePage: React.FC<Props> = ({ onOpenBook, sidebarOpen, onCloseSidebar }) => {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    format: 'All',
    language: 'All',
    priceRange: [0, PRICE_MAX],
    sortBy: 'Relevance',
    searchQuery: '',
  });

  const setFilter = <K extends keyof Filters>(key: K, val: Filters[K]) =>
    setFilters(prev => ({ ...prev, [key]: val }));

  const recommendations = useMemo(() => {
    if (!currentUser) return BOOKS.filter(b => b.isFeatured).slice(0, 6);
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    const purchasedIds = new Set(userOrders.flatMap(o => o.items.map(i => i.book.id)));
    const purchasedCategories = new Set(
      userOrders.flatMap(o => o.items.map(i => i.book.category)).filter(Boolean)
    );
    const scored = BOOKS.map(b => ({
      b,
      score:
        (purchasedCategories.has(b.category) ? 2 : 0) +
        (b.isFeatured ? 1 : 0) +
        (!purchasedIds.has(b.id) ? 1 : 0),
    }));
    return scored.sort((a, z) => z.score - a.score).map(x => x.b).slice(0, 6);
  }, [currentUser, orders]);

  const filtered = useMemo(() => {
    let books = BOOKS.filter(b => {
      const cat  = filters.category === 'All' || b.category === filters.category;
      const fmt  = filters.format   === 'All' || b.format   === filters.format;
      const lang = filters.language === 'All' || b.language === filters.language;
      const price = b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1];
      const search =
        !filters.searchQuery ||
        b.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      return cat && fmt && lang && price && search;
    });
    switch (filters.sortBy) {
      case 'Price: Low to High': books = [...books].sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': books = [...books].sort((a, b) => b.price - a.price); break;
      case 'Rating': books = [...books].sort((a, b) => b.rating - a.rating); break;
      case 'Newest': books = [...books].filter(b => b.isNewLaunch).concat(books.filter(b => !b.isNewLaunch)); break;
      default: break;
    }
    return books;
  }, [filters]);

  const bestsellers = BOOKS.filter(b => b.isBestseller);
  const newLaunches = BOOKS.filter(b => b.isNewLaunch);
  const showingSections = filters.category === 'All' && !filters.searchQuery
    && filters.format === 'All' && filters.language === 'All'
    && filters.priceRange[1] === PRICE_MAX && filters.sortBy === 'Relevance';

  return (
    <div className="home-layout">
      <Sidebar
        active={filters.category}
        onChange={cat => setFilter('category', cat as any)}
        isOpen={sidebarOpen}
        onClose={onCloseSidebar}
      />
      <div className="home-main">
        <div className="home-filter-bar">
          <div className="home-search-wrap">
            <svg className="home-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="home-search-input"
              placeholder="Search you want to read here\u2026"
              value={filters.searchQuery}
              onChange={e => setFilter('searchQuery', e.target.value)}
            />
          </div>
          <select className="home-select" value={filters.language}
            onChange={e => setFilter('language', e.target.value as Language)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l === 'All' ? 'Language: All' : l}</option>)}
          </select>
          <select className="home-select" value={filters.format}
            onChange={e => setFilter('format', e.target.value as Format)}>
            {FORMATS.map(f => <option key={f} value={f}>{f === 'All' ? 'Format: All' : f}</option>)}
          </select>
          <select className="home-select" value={`${filters.priceRange[1]}`}
            onChange={e => setFilter('priceRange', [0, Number(e.target.value)])}>
            <option value="1000">Price Range: All</option>
            <option value="200">Under \u20b9200</option>
            <option value="400">Under \u20b9400</option>
            <option value="600">Under \u20b9600</option>
          </select>
          <select className="home-select" value={filters.sortBy}
            onChange={e => setFilter('sortBy', e.target.value as SortBy)}>
            {SORT_OPTIONS.map(s => <option key={s} value={s}>{s === 'Relevance' ? `Sort: ${s}` : s}</option>)}
          </select>
        </div>
        <div className="home-content">
          {showingSections ? (
            <>
              <section className="home-section">
                <h2 className="home-section-title">Recommended for You</h2>
                <div className="home-grid">
                  {recommendations.map(b => <BookCard key={b.id} book={b} onOpen={onOpenBook} />)}
                </div>
              </section>
              <section className="home-section">
                <h2 className="home-section-title">Bestsellers this Month</h2>
                <div className="home-grid">
                  {bestsellers.map(b => <BookCard key={b.id} book={b} onOpen={onOpenBook} />)}
                </div>
              </section>
              <section className="home-section">
                <h2 className="home-section-title">New Launches</h2>
                <div className="home-grid">
                  {newLaunches.map(b => <BookCard key={b.id} book={b} onOpen={onOpenBook} />)}
                </div>
              </section>
            </>
          ) : (
            <section className="home-section">
              <h2 className="home-section-title">
                {filters.category !== 'All' ? filters.category : 'Search Results'}
                <span className="home-result-count"> ({filtered.length} books)</span>
              </h2>
              {filtered.length === 0 ? (
                <div className="home-empty">
                  <p style={{ fontSize: '40px' }}>\ud83d\udced</p>
                  <p style={{ color: '#8b949e' }}>No books found. Try adjusting filters.</p>
                </div>
              ) : (
                <div className="home-grid">
                  {filtered.map(b => <BookCard key={b.id} book={b} onOpen={onOpenBook} />)}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
