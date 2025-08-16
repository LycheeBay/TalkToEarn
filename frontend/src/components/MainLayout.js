import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import ViewHangoutsScreen from '../screens/ViewHangoutsScreen';
import FindPeopleScreen from '../screens/FindPeopleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/hangouts')) return 'hangouts';
    if (path.includes('/people')) return 'people';
    if (path.includes('/profile')) return 'profile';
    return 'home';
  };

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'home':
        navigate('/app');
        break;
      case 'hangouts':
        navigate('/app/hangouts');
        break;
      case 'people':
        navigate('/app/people');
        break;
      case 'profile':
        navigate('/app/profile');
        break;
      default:
        navigate('/app');
    }
  };

  const currentTab = getCurrentTab();

  return (
    <div className="main-layout">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/hangouts" element={<ViewHangoutsScreen />} />
          <Route path="/people" element={<FindPeopleScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabClick('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'hangouts' ? 'active' : ''}`}
          onClick={() => handleTabClick('hangouts')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Hangouts</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'people' ? 'active' : ''}`}
          onClick={() => handleTabClick('people')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">Find People</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;
