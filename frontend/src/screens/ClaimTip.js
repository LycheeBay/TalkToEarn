import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'
import { getRecords } from '@ensdomains/ensjs/public'


const ClaimTip = () => {
  const navigate = useNavigate();
  const [ens, setens] = useState("");
  const [useradress, setuseradress] = useState("");
  const [amount, setAmount] = useState(0);
  const [showMeetupQR, setShowMeetupQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [meetupQRUrl, setMeetupQRUrl] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [currentMeetupCode, setCurrentMeetupCode] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const client = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  })

  // Get user's bounties from localStorage
  const [userBounties, setUserBounties] = useState([]);
  const [selectedBountyForQR, setSelectedBountyForQR] = useState(null);

  useEffect(() => {
    const currentUserEmail = 'john.doe@example.com'; // In real app, get from auth context
    const allBounties = JSON.parse(localStorage.getItem('bounties') || '[]');
    const ownedBounties = allBounties.filter(bounty => bounty.owner === currentUserEmail);
    setUserBounties(ownedBounties);
  }, []);

  const quickActions = [
    { id: 1, title: 'Find People', icon: '👥', route: '/app/people' },
    { id: 2, title: 'View Bounties', icon: '�', route: '/app/bounties' },
    { id: 3, title: 'Post Bounty', icon: '➕', route: '/app/bounty' },
  ];

  const handleActionClick = (action) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  const generateBountyQR = async (bounty) => {
    try {
      // Dynamic import to avoid build issues
      const QRCode = await import('qrcode');
      // Generate bounty QR code with bounty data
      const bountyCode = `bounty_${bounty.id}_${bounty.owner}_${Date.now()}`;
      setCurrentMeetupCode(bountyCode);
      
      const qrCodeDataUrl = await QRCode.default.toDataURL(bountyCode, {
        width: 250,
        margin: 2,
        color: {
          dark: '#059669',
          light: '#ffffff'
        }
      });
      setMeetupQRUrl(qrCodeDataUrl);
      return bountyCode;
    } catch (error) {
      console.error('Error generating bounty QR code:', error);
      return '';
    }
  };

  const handleGenerateBountyQR = (bounty) => {
    if (!bounty) {
      alert('Please select a bounty first!');
      return;
    }
    setSelectedBountyForQR(bounty);
    setShowMeetupQR(true);
    generateBountyQR(bounty);
  };

  const handleScanMeetup = async () => {
    setShowScanner(true);
  };

  const closeMeetupQR = () => {
    setShowMeetupQR(false);
    setMeetupQRUrl('');
    setCurrentMeetupCode('');
    setSelectedBountyForQR(null);
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

  const getens = async () => {
    const ethAddress = await client.getAddressRecord({ name: ens });
    console.log(ethAddress);
    setuseradress(ethAddress.value);

    const records = await getRecords(client, {
      name: ens,
      records: {
        texts: ['avatar', 'description', 'email', 'url', 'twitter', 'github'],
        coins: ['ETH', 'BTC'],
        contentHash: true
      }
    })
    console.log(records);
  }

  const startScanner = async () => {
    if (videoRef.current && !qrScannerRef.current) {
      try {
        // Dynamic import to avoid build issues
        const QrScanner = await import('qr-scanner');
        qrScannerRef.current = new QrScanner.default(
          videoRef.current,
          (result) => {
            setScanResult(result.data);
            if (result.data.startsWith('bounty_')) {
              console.log('🎉 BOUNTY FULFILLED! Scanned bounty QR code:', result.data);
              alert(`Bounty completed! QR code: ${result.data}`);
              closeScanner();
            } else if (result.data.startsWith('user_')) {
              alert(`Successfully scanned user profile: ${result.data}`);
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
          <h1 className="welcome-text">Tip Someone</h1>
          <p className="home-subtitle">Send reward to someone </p>
        </div>

        <div className="home-section">
          <div className="bounty-management-area">
            <div>
              <h3>Scan Wallet Address</h3>
              <button 
                className="scan-qr-btn"
                onClick={handleScanMeetup}
              >
                Scan QR Code
              </button>
            </div>
            <div className="scan-section">
              Or
            </div>
            <br />
            <div className="form-group">
              <label className="form-label">
                Enter ENS <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="test.eth"
                value={ens}
                onChange={(e) => setens(e.target.value)}
              />
              <button 
                className="scan-qr-btn"
                onClick={getens}
              >
                Check
              </button>

              <p>{useradress}</p>
            </div>

            {useradress && <div className="form-group">
              <label className="form-label">
                Enter Amount (FLOW)<span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button 
                className="scan-qr-btn"
              >
                Send
              </button>
            </div>}
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
          <h2 className="section-title">My Active Bounties</h2>
          {userBounties.length > 0 ? (
            userBounties.map((bounty) => (
              <div key={bounty.id} className="bounty-card-mini">
                <div className="bounty-info">
                  <h3 className="bounty-title">{bounty.title}</h3>
                  <p className="bounty-reward">Reward: {bounty.reward} ETH</p>
                  <p className="bounty-stake">Staked: {bounty.stakeAmount} ETH</p>
                </div>
                <div className="bounty-status">
                  <span className="applicant-count">{bounty.applicants?.length || 0}</span>
                  <span className="applicant-label">applicants</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-bounties-placeholder">
              <p>No active bounties. Create your first bounty to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Meetup QR Code Modal */}
      {showMeetupQR && (
        <div className="qr-modal-overlay" onClick={closeMeetupQR}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Bounty QR Code</h3>
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
                <p><strong>Bounty:</strong> {selectedBountyForQR?.title}</p>
                <p><strong>Reward:</strong> {selectedBountyForQR?.reward} ETH</p>
                <p><strong>QR Code:</strong> {currentMeetupCode}</p>
                <p className="qr-instructions">
                  Share this QR code with the applicant to confirm bounty completion!
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

export default ClaimTip;
