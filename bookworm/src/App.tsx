import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import MyWritersPage from './pages/MyWritersPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import Header from './components/Header';
import { Book } from './types';

export type Page = 'home' | 'orders' | 'wishlist' | 'writers' | 'cart' | 'payment';

export interface PaymentInfo {
  grandTotal: number;
  address: string;
}

type AuthScreen = 'login' | 'register';

const AppShell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({ grandTotal: 0, address: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenBook = (book: Book) => setSelectedBook(book);
  const handleBackFromDetail = () => setSelectedBook(null);

  const handleNavigate = (page: Page) => {
    setSelectedBook(null);
    setActivePage(page);
    setSidebarOpen(false);
  };

  const handleGoToPayment = (info: PaymentInfo) => {
    setPaymentInfo(info);
    setActivePage('payment');
  };

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          onSuccess={() => setActivePage('home')}
          onGoToLogin={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={() => setActivePage('home')}
        onGoToRegister={() => setAuthScreen('register')}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />
      <div className="app-body">
        {selectedBook ? (
          <BookDetailPage
            book={selectedBook}
            onBack={handleBackFromDetail}
            onOpenBook={handleOpenBook}
            onGoToCart={() => handleNavigate('cart')}
          />
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage
                onOpenBook={handleOpenBook}
                sidebarOpen={sidebarOpen}
                onCloseSidebar={() => setSidebarOpen(false)}
              />
            )}
            {activePage === 'orders'   && <OrdersPage />}
            {activePage === 'wishlist' && <WishlistPage onOpenBook={handleOpenBook} />}
            {activePage === 'writers'  && <MyWritersPage onOpenBook={handleOpenBook} />}
            {activePage === 'cart'     && (
              <CartPage
                onBack={() => handleNavigate('home')}
                onGoToPayment={handleGoToPayment}
              />
            )}
            {activePage === 'payment'  && (
              <PaymentPage
                grandTotal={paymentInfo.grandTotal}
                address={paymentInfo.address}
                onBack={() => handleNavigate('cart')}
                onHome={() => handleNavigate('home')}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <OrderProvider>
        <AppShell />
      </OrderProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
