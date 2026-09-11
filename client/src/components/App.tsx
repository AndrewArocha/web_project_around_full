import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

// Componentes visuales
import Login from './Login/Login';
import Register from './Register/Register';

import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import type { UserData, CardData, PopupConfig, CardFormData } from '../types/types';
import InfoTooltip from './InfoTooltip/InfoTooltip';

// Auth
import * as auth from '../utils/auth';

function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [popup, setPopup] = useState<PopupConfig | null>(null);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Estado de autenticación
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Validar token persistente al recargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            navigate('/');
          }
        })
        .catch(console.error);
    }
  }, [navigate]);

  // Carga inicial de datos de la API local
  useEffect(() => {
    (async () => {
      try {
        const [userData, initialCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards()
        ]);
        setCurrentUser(userData);
        setCards(initialCards);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    })();
  }, []);

  // --- Funciones de Autenticación ---

const handleLogin = async (password: string, email: string) => {
    try {
      const data = await auth.login(password, email);
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        setLoggedIn(true);
        navigate('/');
      }
    } catch (error) {
      console.error("Error en login:", error);
      setIsSuccess(false);
      setIsInfoTooltipOpen(true);
    }
  };

  const handleRegister = async (password: string, email: string) => {
    try {
      await auth.register(password, email);
      setIsSuccess(true);
      setIsInfoTooltipOpen(true);
    } catch (error) {
      console.error("Error en registro:", error);
      setIsSuccess(false);
      setIsInfoTooltipOpen(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/signin');
  };

  // --- Funciones de Interfaz y Datos ---

  function handleOpenPopup(popupConfig: PopupConfig) {
    setPopup(popupConfig);
  }

function handleClosePopup() {
    setPopup(null);
    setIsInfoTooltipOpen(false);
    
    if (isInfoTooltipOpen && isSuccess) {
      navigate('/signin');
    }
    
  }

  const handleUpdateUser = async (userData: { name: string; about: string }) => {
    try {
      const updatedUser = await api.updateUserInfo(userData.name, userData.about);
      setCurrentUser(updatedUser);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAvatar = async (userData: { avatar: string }) => {
    try {
      const updatedUser = await api.updateAvatar(userData.avatar);
      setCurrentUser(updatedUser);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPlaceSubmit = async (data: CardFormData) => {
    try {
      const newCard = await api.addCard(data);
      setCards((state) => [newCard, ...state]);
      handleClosePopup();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardLike = async (card: CardData) => {
    const isLiked = card.isLiked;
    try {
      const apiCall = isLiked ? api.removeLike(card._id) : api.addLike(card._id);
      const newCard = await apiCall;
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardDelete = async (card: CardData) => {
    try {
      await api.deleteCard(card._id);
      setCards((state) => state.filter((c) => c._id !== card._id));
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, handleUpdateUser, handleUpdateAvatar, handleAddPlaceSubmit, handleOpenPopup, handleClosePopup, popup, handleLogin, handleRegister, handleSignOut }}>
      <div className="page">
        <div className="page__content">
          <Header
            loggedIn={loggedIn}
            userEmail={currentUser?.email ?? ''}
            onSignOut={handleSignOut}
          />

          <Routes>
            {/* Ruta Protegida: El núcleo de tu app */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    cards={cards}
                    handleOpenPopup={handleOpenPopup}
                    handleClosePopup={handleClosePopup}
                    popup={popup}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                </ProtectedRoute>
              } 
            />

            {/* Rutas Públicas */}
            <Route 
              path="/signin" 
              element={
                loggedIn ? <Navigate to="/" replace /> : <Login handleLogin={handleLogin} />
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                loggedIn ? <Navigate to="/" replace /> : <Register handleRegister={handleRegister} />
              } 
            />

            {/* Captura de rutas inexistentes */}
            <Route 
              path="*" 
              element={
                loggedIn ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />
              } 
            />
          </Routes>

          <Footer />
          <InfoTooltip 
            isOpen={isInfoTooltipOpen} 
            onClose={handleClosePopup} 
            isSuccess={isSuccess} 
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;