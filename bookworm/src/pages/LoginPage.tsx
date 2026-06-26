import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<Props> = ({ onSuccess, onGoToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('soumik@bookworm.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError('Invalid email or password. Try: soumik@bookworm.com / password123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-row">
          <div className="login-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#4f8ef7" />
              <path d="M7 8h5v12H7zM16 8h5v12h-5z" fill="#fff" opacity=".9" />
              <path d="M12 14h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="login-logo-text">Book Worm</span>
        </div>

        <h2 className="login-heading">Welcome Back</h2>
        <p className="login-sub">Sign in to explore millions of books</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            required
            autoComplete="current-password"
          />
          {error && <p className="login-error">{error}</p>}
          <button
            className="login-btn"
            style={{ opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in\u2026' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider"><span>Demo Accounts</span></div>
        <div className="login-demo-accounts">
          <button
            className="login-demo-btn"
            onClick={() => { setEmail('soumik@bookworm.com'); setPassword('password123'); }}
          >
            soumik@bookworm.com
          </button>
          <button
            className="login-demo-btn"
            onClick={() => { setEmail('priya@bookworm.com'); setPassword('priya2024'); }}
          >
            priya@bookworm.com
          </button>
        </div>

        <p className="login-hint">
          New here?{' '}
          <span className="login-hint-link" onClick={onGoToRegister}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
