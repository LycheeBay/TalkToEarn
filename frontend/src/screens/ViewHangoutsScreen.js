import React, { useState } from 'react';
import './ViewHangoutsScreen.css';

const ViewHangoutsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const hangouts = [
    {
      id: 1,
      title: 'Morning Coffee Chat',
      description: 'Casual coffee meetup to start the day right',
      date: 'Today, 9:00 AM',
      location: 'Central Cafe',
      participants: 5,
      maxParticipants: 8,
      category: 'Social',
    },
    {
      id: 2,
      title: 'Study Group - React Native',
      description: 'Learning mobile app development together',
      date: 'Tomorrow, 2:00 PM',
      location: 'Library Room 301',
      participants: 3,
      maxParticipants: 6,
      category: 'Study',
    },
    {
      id: 3,
      title: 'Weekend Hiking Adventure',
      description: 'Explore the beautiful mountain trails',
      date: 'Saturday, 7:00 AM',
      location: 'Mountain Trail Park',
      participants: 12,
      maxParticipants: 15,
      category: 'Sports',
    },
    {
      id: 4,
      title: 'Board Game Night',
      description: 'Fun evening with classic and modern board games',
      date: 'Friday, 7:00 PM',
      location: 'Community Center',
      participants: 8,
      maxParticipants: 12,
      category: 'Entertainment',
    },
  ];

  const filters = ['All', 'Social', 'Study', 'Sports', 'Entertainment'];

  const filteredHangouts = hangouts.filter(hangout => {
    const matchesSearch = hangout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hangout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || hangout.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getParticipationStatus = (participants, maxParticipants) => {
    const ratio = participants / maxParticipants;
    if (ratio >= 0.8) return { color: '#ef4444', text: 'Almost Full' };
    if (ratio >= 0.5) return { color: '#f59e0b', text: 'Half Full' };
    return { color: '#10b981', text: 'Open' };
  };

  const handleJoinHangout = (hangoutId) => {
    alert(`Joined hangout ${hangoutId}!`);
  };

  return (
    <div className="hangouts-container">
      <div className="hangouts-content">
        <div className="hangouts-header">
          <h1 className="hangouts-title">Hangouts</h1>
          <input
            className="search-input"
            type="text"
            placeholder="Search hangouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-container">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="hangouts-list">
          {filteredHangouts.map((hangout) => {
            const status = getParticipationStatus(hangout.participants, hangout.maxParticipants);
            return (
              <div key={hangout.id} className="hangout-card">
                <div className="card-header">
                  <h3 className="hangout-title">{hangout.title}</h3>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: status.color + '20', color: status.color }}
                  >
                    {status.text}
                  </span>
                </div>
                
                <p className="hangout-description">{hangout.description}</p>
                
                <div className="hangout-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{hangout.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{hangout.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">
                      {hangout.participants}/{hangout.maxParticipants} people
                    </span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary join-button"
                  onClick={() => handleJoinHangout(hangout.id)}
                >
                  Join Hangout
                </button>
              </div>
            );
          })}
        </div>

        {filteredHangouts.length === 0 && (
          <div className="empty-state">
            <h3>No hangouts found</h3>
            <p>Try adjusting your search or filters to find more hangouts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHangoutsScreen;
