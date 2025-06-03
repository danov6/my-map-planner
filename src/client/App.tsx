import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TravelOption } from './context/AppContext';
import Modal from './components/Modal';
import BlogList from './components/BlogList';
import Navbar from './components/Navbar';
import { AppContext } from './context/AppContext';
import { BlogPost } from '../shared/types';
import './styles/global.css';
import './styles/modal.css';
import ProfilePage from './pages/ProfilePage';

//Pages
import GuidePage from './pages/GuidePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{ countryCode: string, name: string } | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);
  const [guide, setGuide] = useState<{ header: string, content: string }[] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  } | null>(null);

  const formatQueryString = (options: TravelOption[]) => {
    return options.map(option => `option=${encodeURIComponent(option.id)}`).join('&');
  };

  const parseQueryString = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const options: TravelOption[] = [];
    
    queryParams.forEach((value, key) => {
      if (key === 'option') {
        options.push({
          id: decodeURIComponent(value),
          text: ''
        });
      }
    });

    if (options.length > 0) {
      setSelectedOptions(options);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    parseQueryString();
  }, []);

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      //console.log('Giordano', formatQueryString(selectedOptions));
    }
  }, [selectedOptions]);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <Router>
      <AppContext.Provider value={{ 
        guide,
        setGuide,
        selectedCountry, 
        blogs, 
        setSelectedCountry,
        isModalOpen,
        setIsModalOpen,
        selectedOptions,
        setSelectedOptions,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout
      }}>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </main>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedCountry?.name || 'Country Details'}
          />
        </div>
      </AppContext.Provider>
    </Router>
  );
};

export default App;