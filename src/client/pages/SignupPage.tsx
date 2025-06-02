import React, { useState, useCallback, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/authApi';
import { validateEmail, validatePassword } from '../utils/validation';
import { AppContext } from '../context/AppContext';
import '../styles/login.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AppContext);

  const validateForm = useCallback((): string | null => {
    if (!email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }
    if (!validateEmail(email)) {
      return 'Please enter a valid email address';
    }
    if (!validatePassword(password)) {
      return 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }, [email, password, confirmPassword]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser({ email, password });
      
      // Defer token storage and navigation to next tick
      setTimeout(() => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        navigate('/profile');
      }, 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, validateForm, navigate, setIsAuthenticated, setUser]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create Account</h2>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;