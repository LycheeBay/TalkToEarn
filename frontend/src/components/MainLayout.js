import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import ViewHangoutsScreen from '../screens/ViewHangoutsScreen';
import FindPeopleScreen from '../screens/FindPeopleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BountyScreen from '../screens/BountyScreen';
import './MainLayout.css';

const MainLayout = ({ contract, ethAddress }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!ethAddress) navigate('/login');
  }, [])
  
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/bounties')) return 'bounties';
    if (path.includes('/bounty')) return 'bounty';
    if (path.includes('/people')) return 'people';
    if (path.includes('/profile')) return 'profile';
    return 'home';
  };

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'home':
        navigate('/app');
        break;
      case 'bounties':
        navigate('/app/bounties');
        break;
      case 'bounty':
        navigate('/app/bounty');
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
          <Route path="/bounties" element={<ViewHangoutsScreen />} />
          <Route path="/bounty" element={<BountyScreen contract={contract} />} />
          <Route path="/people" element={<FindPeopleScreen />} />
          <Route path="/profile" element={<ProfileScreen ethAddress={ethAddress} />} />
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
          className={`nav-item ${currentTab === 'bounties' ? 'active' : ''}`}
          onClick={() => handleTabClick('bounties')}
        >
          <span className="nav-icon">�</span>
          <span className="nav-label">View Bounties</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'bounty' ? 'active' : ''}`}
          onClick={() => handleTabClick('bounty')}
        >
          <span className="nav-icon">💰</span>
          <span className="nav-label">Post Bounty</span>
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
