import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();

  const recentHangouts = [
    { id: 1, title: 'Coffee Chat', time: '2 hours ago', participants: 3 },
    { id: 2, title: 'Study Group', time: '1 day ago', participants: 5 },
    { id: 3, title: 'Weekend Hike', time: '3 days ago', participants: 8 },
  ];

  const quickActions = [
    { id: 1, title: 'Find People', icon: '👥', route: '/app/people' },
    { id: 2, title: 'View Hangouts', icon: '📅', route: '/app/hangouts' },
    { id: 3, title: 'Create Hangout', icon: '➕', action: 'create' },
  ];

  const handleActionClick = (action) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.action === 'create') {
      alert('Create hangout feature coming soon!');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="welcome-text">Welcome back!</h1>
          <p className="home-subtitle">What would you like to do today?</p>
        </div>

        <div className="home-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="action-card"
                onClick={() => handleActionClick(action)}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="home-section">
          <h2 className="section-title">Recent Hangouts</h2>
          {recentHangouts.map((hangout) => (
            <div key={hangout.id} className="hangout-card">
              <div className="hangout-info">
                <h3 className="hangout-title">{hangout.title}</h3>
                <p className="hangout-time">{hangout.time}</p>
              </div>
              <div className="participants">
                <span className="participant-count">{hangout.participants}</span>
                <span className="participant-label">people</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
