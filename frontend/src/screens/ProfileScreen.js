import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileScreen.css';

const ProfileScreen = ({ ethAddress }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [userQRCodeUrl, setUserQRCodeUrl] = useState('');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Love meeting new people and exploring the city. Always up for coffee and good conversations!',
    location: 'New York, NY',
    interests: ['Coffee', 'Photography', 'Hiking', 'Technology'],
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const stats = [
    { label: 'Hangouts Joined', value: '23' },
    { label: 'People Met', value: '45' },
    { label: 'Reviews', value: '18' },
  ];

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/', { replace: true });
    }
  };

  const addInterest = () => {
    const text = prompt('What are you interested in?');
    if (text && text.trim() !== '') {
      setEditedProfile(prev => ({
        ...prev,
        interests: [...prev.interests, text.trim()]
      }));
    }
  };

  const generateUserQRCode = async () => {
    try {
      // Dynamic import to avoid build issues
      const QRCode = await import('qrcode');
      // Generate a unique user QR code based on user info
      const userCode = `user_${profile.email}_${Date.now().toString(36)}`;
      const qrCodeDataUrl = await QRCode.default.toDataURL(userCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });
      setUserQRCodeUrl(qrCodeDataUrl);
      return userCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  useEffect(() => {
    if (showQRCode && !userQRCodeUrl) {
      generateUserQRCode();
    }
  }, [showQRCode]);

  const removeInterest = (index) => {
    setEditedProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">👤</div>
          </div>
          <div className="header-buttons">
            {!isEditing ? (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {isEditing ? (
            <input
              type="text"
              className="name-input"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
          ) : (
            <h2 className="name">{ethAddress}</h2>
          )}
          
          <p className="email">{profile.email}</p>
          
          {isEditing ? (
            <input
              type="text"
              className="location-input"
              value={editedProfile.location}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Your location"
            />
          ) : (
            <p className="location">📍 {profile.location}</p>
          )}
        </div>

        {/* Stats */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="section">
          <h3 className="section-title">About Me</h3>
          {isEditing ? (
            <textarea
              className="bio-input"
              value={editedProfile.bio}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell people about yourself..."
              rows={4}
            />
          ) : (
            <p className="bio">{profile.bio}</p>
          )}
        </div>

        {/* Interests */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">Interests</h3>
            {isEditing && (
              <button className="add-button" onClick={addInterest}>
                + Add
              </button>
            )}
          </div>
          <div className="interests-list">
            {(isEditing ? editedProfile.interests : profile.interests).map((interest, index) => (
              <div key={index} className="interest-tag">
                <span className="interest-text">{interest}</span>
                {isEditing && (
                  <button
                    className="remove-interest"
                    onClick={() => removeInterest(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">My QR Code</h3>
            <button 
              className="qr-toggle-button"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              {showQRCode ? 'Hide' : 'Show'}
            </button>
          </div>
          {showQRCode && (
            <div className="qr-code-section">
              <div className="user-qr-container">
                <div className="user-qr-visual">
                  {userQRCodeUrl ? (
                    <img 
                      src={userQRCodeUrl} 
                      alt="User QR Code" 
                      className="qr-code-image"
                    />
                  ) : (
                    <div className="qr-loading">Generating QR Code...</div>
                  )}
                </div>
                <div className="qr-info">
                  <p><strong>Your unique profile QR code</strong></p>
                  <p className="qr-description">
                    Others can scan this to add you as a contact or confirm meetups
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="section">
          <h3 className="section-title">Settings</h3>
          <button className="setting-item">
            <span className="setting-text">Notifications</span>
            <span className="setting-arrow">›</span>
          </button>
          <button className="setting-item">
            <span className="setting-text">Privacy</span>
            <span className="setting-arrow">›</span>
          </button>
          <button className="setting-item">
            <span className="setting-text">Help & Support</span>
            <span className="setting-arrow">›</span>
          </button>
        </div>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};



export default ProfileScreen;
