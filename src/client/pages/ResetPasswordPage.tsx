import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetToken, resetPassword } from '../services/auth';
import { validateEmail, validatePassword } from '../utils';
import '../styles/login.css';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        const { email: userEmail } = await verifyResetToken(token);
        setEmail(userEmail);
        setIsLoading(false);
      } catch (error) {
        navigate('/login', { 
          state: { error: 'Reset token has expired. Please try again' }
        });
      }
    };

    verifyToken();
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = new URLSearchParams(location.search).get('token') || '';
      await resetPassword(token, email, password);
      navigate('/login', { 
        state: { success: 'Password has been reset successfully' }
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    }
  };

  if (isLoading) {
    return <div className="login-container">Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button 
              type="submit" 
              className="auth-button primary"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;