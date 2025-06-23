import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TravelOption } from './context/AppContext';
import Modal from './components/Modal';
import Navbar from './components/Navbar';
import { AppContext } from './context/AppContext';
import './styles/global.css';
import './styles/modal.css';
import ProfilePage from './pages/ProfilePage';
import { Article } from 'shared/types';

//Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ViewArticlePage from './pages/ViewArticlePage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import CountryPage from './pages/CountryPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TopicPage from './pages/TopicPage';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{ countryCode: string, name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<TravelOption[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [highlightedMapCountries, setHighlightedMapCountries] = useState<string[] | null>([]);
  const [isFlightsSectionClosed, setIsFlightsSectionClosed] = useState(false);
  const [user, setUser] = useState<{
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  } | any>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

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
        selectedCountry, 
        setSelectedCountry,
        isModalOpen,
        setIsModalOpen,
        selectedOptions,
        setSelectedOptions,
        isAuthenticated,
        setIsAuthenticated,
        setArticles,
        articles,
        user,
        setUser,
        logout,
        highlightedMapCountries,
        setHighlightedMapCountries,
        isFlightsSectionClosed,
        setIsFlightsSectionClosed
      }}>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/articles">
                <Route index element={<HomePage />} />
                <Route path="create" element={<CreateArticlePage />} />
                <Route path=":id" element={<ViewArticlePage />} />
                <Route path=":id/edit" element={<EditArticlePage />} />
              </Route>
              <Route path="/countries/:id" element={<CountryPage />} />
              <Route path="/topics/:topic" element={<TopicPage />} />
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