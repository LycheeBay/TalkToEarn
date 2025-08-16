import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [showMeetupQR, setShowMeetupQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [meetupQRUrl, setMeetupQRUrl] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [currentMeetupCode, setCurrentMeetupCode] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

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

  const generateMeetupQR = async () => {
    try {
      // Dynamic import to avoid build issues
      const QRCode = await import('qrcode');
      // Generate a unique meetup code based on timestamp and user
      const meetupCode = `meetup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentMeetupCode(meetupCode);
      
      const qrCodeDataUrl = await QRCode.default.toDataURL(meetupCode, {
        width: 250,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#ffffff'
        }
      });
      setMeetupQRUrl(qrCodeDataUrl);
      return meetupCode;
    } catch (error) {
      console.error('Error generating meetup QR code:', error);
      return '';
    }
  };

  const handleConfirmMeetup = () => {
    setShowMeetupQR(true);
    generateMeetupQR();
  };

  const handleScanMeetup = async () => {
    setShowScanner(true);
  };

  const closeMeetupQR = () => {
    setShowMeetupQR(false);
    setMeetupQRUrl('');
    setCurrentMeetupCode('');
  };

  const closeScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setShowScanner(false);
    setScanResult('');
  };

  const startScanner = async () => {
    if (videoRef.current && !qrScannerRef.current) {
      try {
        // Dynamic import to avoid build issues
        const QrScanner = await import('qr-scanner');
        qrScannerRef.current = new QrScanner.default(
          videoRef.current,
          (result) => {
            setScanResult(result.data);
            if (result.data.startsWith('meetup_') || result.data.startsWith('user_')) {
              alert(`Successfully scanned: ${result.data}`);
              closeScanner();
            }
          },
          {
            onDecodeError: (error) => {
              // Ignore decode errors, they're expected when no QR code is visible
            },
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        await qrScannerRef.current.start();
      } catch (error) {
        console.error('Error starting QR scanner:', error);
        alert('Unable to access camera. Please make sure you have given camera permissions.');
        closeScanner();
      }
    }
  };

  useEffect(() => {
    if (showScanner) {
      startScanner();
    }
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [showScanner]);

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
                <p>Generate or scan QR codes to confirm meetups</p>
              </div>
              <div className="meetup-buttons">
                <button 
                  className="meetup-cta-button generate-qr"
                  onClick={handleConfirmMeetup}
                >
                  Generate QR
                </button>
                <button 
                  className="meetup-cta-button scan-qr"
                  onClick={handleScanMeetup}
                >
                  Scan QR
                </button>
              </div>
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
              <h3>Meetup Confirmation QR</h3>
              <button className="close-button" onClick={closeMeetupQR}>×</button>
            </div>
            <div className="qr-code-container">
              <div className="qr-code-display">
                {meetupQRUrl ? (
                  <img 
                    src={meetupQRUrl} 
                    alt="Meetup QR Code" 
                    className="qr-code-image"
                  />
                ) : (
                  <div className="qr-loading">Generating QR Code...</div>
                )}
              </div>
              <div className="qr-code-info">
                <p><strong>Meetup Code:</strong> {currentMeetupCode}</p>
                <p className="qr-instructions">
                  Ask the other person to scan this QR code to confirm your meetup!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="qr-modal-overlay" onClick={closeScanner}>
          <div className="qr-modal-content scanner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Scan QR Code</h3>
              <button className="close-button" onClick={closeScanner}>×</button>
            </div>
            <div className="scanner-container">
              <video 
                ref={videoRef}
                className="scanner-video"
                playsInline
                muted
              />
              <p className="scanner-instructions">
                Point your camera at a QR code to scan it
              </p>
              {scanResult && (
                <div className="scan-result">
                  <p><strong>Scanned:</strong> {scanResult}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
