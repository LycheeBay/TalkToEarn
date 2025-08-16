import React, { useState, useEffect } from 'react';
import './ViewHangoutsScreen.css';

const ViewHangoutsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bounties, setBounties] = useState([]);

  useEffect(() => {
    // Load bounties from localStorage
    const storedHangouts = JSON.parse(localStorage.getItem('hangouts') || '[]');
    setBounties(storedHangouts);
  }, []);

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

  const filters = ['All', 'Social', 'Study', 'Sports', 'Entertainment', 'Bounties'];

  // Combine hangouts and bounties
  const allEvents = [...hangouts, ...bounties];

  const filteredHangouts = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         event.category === activeFilter ||
                         (activeFilter === 'Bounties' && event.type === 'bounty');
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
          {filteredHangouts.map((event) => {
            const isBounty = event.type === 'bounty';
            const status = isBounty ? 
              { color: '#f59e0b', text: 'Bounty' } : 
              getParticipationStatus(event.participants, event.maxParticipants);
            
            return (
              <div key={event.id} className={`hangout-card ${isBounty ? 'bounty-card' : ''}`}>
                <div className="card-header">
                  <h3 className="hangout-title">{event.title}</h3>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: status.color + '20', color: status.color }}
                  >
                    {isBounty ? '💰 ' + status.text : status.text}
                  </span>
                </div>
                
                <p className="hangout-description">{event.description}</p>
                
                {isBounty && event.reward && (
                  <div className="bounty-reward">
                    <span className="reward-label">Reward:</span>
                    <span className="reward-value">{event.reward}</span>
                  </div>
                )}
                
                <div className="hangout-details">
                  {event.date && (
                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{event.date}</span>
                    </div>
                  )}
                  {event.deadline && (
                    <div className="detail-row">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-text">
                        Deadline: {new Date(event.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{event.location}</span>
                    </div>
                  )}
                  {!isBounty && (
                    <div className="detail-row">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">
                        {event.participants}/{event.maxParticipants} people
                      </span>
                    </div>
                  )}
                  {isBounty && event.maxParticipants && (
                    <div className="detail-row">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">
                        Max {event.maxParticipants} participants
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  className={`btn ${isBounty ? 'btn-bounty' : 'btn-primary'} join-button`}
                  onClick={() => handleJoinHangout(event.id)}
                >
                  {isBounty ? 'Apply for Bounty' : 'Join Hangout'}
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
