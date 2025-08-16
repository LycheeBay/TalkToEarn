import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [showMeetupQR, setShowMeetupQR] = useState(false);

  const recentHangouts = [
    { id: 1, title: 'Coffee Chat', time: '2 hours ago', participants: 3 },
    { id: 2, title: 'Study Group', time: '1 day ago', participants: 5 },
    { id: 3, title: 'Weekend Hike', time: '3 days ago', participants: 8 },
  ];

  const quickActions = [
    { id: 1, title: 'Find People', icon: '👥', route: '/app/people' },
    { id: 2, title: 'View Hangouts', icon: '📅', route: '/app/hangouts' },
    { id: 3, title: 'Post Bounty', icon: '💰', route: '/app/bounty' },
  ];

  const handleActionClick = (action) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  const generateMeetupQR = () => {
    // Generate a unique meetup code based on timestamp and user
    const meetupCode = `meetup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return meetupCode;
  };

  const handleConfirmMeetup = () => {
    setShowMeetupQR(true);
  };

  const closeMeetupQR = () => {
    setShowMeetupQR(false);
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
          <h2 className="section-title">Confirm Meetup</h2>
          <div className="meetup-confirmation-area">
            <div className="meetup-prompt">
              <span className="meetup-icon">🤝</span>
              <div className="meetup-text">
                <h3>Met someone from the app?</h3>
                <p>Generate a QR code to confirm your meetup</p>
              </div>
              <button 
                className="meetup-cta-button"
                onClick={handleConfirmMeetup}
              >
                Confirm Meetup
              </button>
            </div>
          </div>
        </div>

        <div className="home-section">
          <h2 className="section-title">Post a Bounty</h2>
          <div className="bounty-posting-area">
            <div className="bounty-prompt">
              <span className="bounty-icon">💰</span>
              <div className="bounty-text">
                <h3>Need help with something?</h3>
                <p>Post a bounty and offer rewards for assistance</p>
              </div>
              <button 
                className="bounty-cta-button"
                onClick={() => navigate('/app/bounty')}
              >
                Post Bounty
              </button>
            </div>
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

      {/* Meetup QR Code Modal */}
      {showMeetupQR && (
        <div className="qr-modal-overlay" onClick={closeMeetupQR}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Meetup Confirmation</h3>
              <button className="close-button" onClick={closeMeetupQR}>×</button>
            </div>
            <div className="qr-code-container">
              <div className="qr-code-placeholder">
                <div className="qr-code-visual">
                  {/* Simple QR code visualization */}
                  <div className="qr-grid">
                    {Array.from({ length: 225 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`qr-dot ${Math.random() > 0.5 ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="qr-code-info">
                <p><strong>Meetup Code:</strong> {generateMeetupQR()}</p>
                <p className="qr-instructions">
                  Ask the other person to scan this QR code to confirm your meetup!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
