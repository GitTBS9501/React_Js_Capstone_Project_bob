import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<Props> = ({ onSuccess, onGoToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (password.length < 6)    { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm)   { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await register(name.trim(), email, password);
    setLoading(false);
    if (result === 'ok') {
      onSuccess();
    } else {
      setError('An account with this email already exists.');
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

        <h2 className="login-heading">Create Account</h2>
        <p className="login-sub">Join millions of readers today</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Full Name</label>
          <input className="login-input" type="text" value={name}
            onChange={e => setName(e.target.value)} placeholder="Your full name"
            required autoComplete="name" />
          <label className="login-label">Email</label>
          <input className="login-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            required autoComplete="email" />
          <label className="login-label">Password</label>
          <input className="login-input" type="password" value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
            required autoComplete="new-password" />
          <label className="login-label">Confirm Password</label>
          <input className="login-input" type="password" value={confirm}
            onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password"
            required autoComplete="new-password" />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account\u2026' : 'Create Account'}
          </button>
        </form>

        <p className="login-hint">
          Already have an account?{' '}
          <span className="login-hint-link" onClick={onGoToLogin}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
