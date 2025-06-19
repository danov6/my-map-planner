import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../services/auth';
import { validateEmail } from '../utils';
import Spinner from '../components/Spinner';
import '../styles/login.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      await requestPasswordReset(email);
      setIsEmailSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Check Your Email</h2>
          <p className="success-message">
            If an account exists for {email}, you will receive a password reset link shortly.
            Please check your spam folder if you don't see the email in your inbox.
            The link will expire in 1 hour.
          </p>
          <div className="button-group">
            <button 
              className="auth-button primary"
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
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
              disabled={isLoading}
              required
            />
          </div>
          <div className="button-group">
            <button 
              type="button" 
              className="auth-button secondary"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              Back to Login
            </button>
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;