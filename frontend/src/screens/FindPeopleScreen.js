import React, { useState } from 'react';
import './FindPeopleScreen.css';

const FindPeopleScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock user data
  const people = [
    {
      id: 1,
      name: 'Alex Chen',
      bio: 'Love hiking and photography. Always up for outdoor adventures!',
      interests: ['Hiking', 'Photography', 'Coffee'],
      location: '2.3 miles away',
      avatar: '👨‍💻',
      isOnline: true,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      bio: 'Student at local university. Looking for study buddies and coffee dates.',
      interests: ['Study', 'Coffee', 'Books'],
      location: '1.8 miles away',
      avatar: '👩‍🎓',
      isOnline: false,
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      bio: 'Board game enthusiast and weekend warrior. Let\'s hang out!',
      interests: ['Games', 'Sports', 'Movies'],
      location: '3.1 miles away',
      avatar: '🎮',
      isOnline: true,
    },
    {
      id: 4,
      name: 'Emily Davis',
      bio: 'Fitness lover and yoga instructor. Namaste!',
      interests: ['Fitness', 'Yoga', 'Health'],
      location: '1.2 miles away',
      avatar: '🧘‍♀️',
      isOnline: true,
    },
    {
      id: 5,
      name: 'David Kim',
      bio: 'Tech enthusiast and startup founder. Always learning something new.',
      interests: ['Tech', 'Startups', 'Networking'],
      location: '4.5 miles away',
      avatar: '👨‍💼',
      isOnline: false,
    },
  ];

  const filters = ['All', 'Online', 'Nearby', 'Similar Interests'];

  const getFilteredPeople = () => {
    let filtered = people;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.interests.some(interest =>
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'Online':
        filtered = filtered.filter(person => person.isOnline);
        break;
      case 'Nearby':
        filtered = filtered.filter(person => {
          const distance = parseFloat(person.location.split(' ')[0]);
          return distance < 3;
        });
        break;
      case 'Similar Interests':
        // For demo purposes, show people with common interests
        filtered = filtered.filter(person =>
          person.interests.includes('Coffee') || person.interests.includes('Tech')
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  const handleConnect = (personId, personName) => {
    // Handle connection logic here
    console.log(`Connecting with ${personName}`);
  };

  const renderInterestTag = (interest) => (
    <span key={interest} className="interest-tag">
      {interest}
    </span>
  );

  return (
    <div className="find-people-container">
      <div className="find-people-content">
        <div className="find-people-header">
          <h1 className="find-people-title">Find People</h1>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, interests..."
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

        <div className="people-list">
          {getFilteredPeople().map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-header">
                <div className="avatar-container">
                  <span className="avatar">{person.avatar}</span>
                  {person.isOnline && <div className="online-indicator" />}
                </div>
                <div className="person-info">
                  <h3 className="person-name">{person.name}</h3>
                  <p className="person-location">{person.location}</p>
                </div>
              </div>

              <p className="person-bio">{person.bio}</p>

              <div className="interests-container">
                <p className="interests-label">Interests:</p>
                <div className="interests-list">
                  {person.interests.map(renderInterestTag)}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary connect-button"
                  onClick={() => handleConnect(person.id, person.name)}
                >
                  Connect
                </button>
                <button className="btn btn-secondary message-button">
                  Message
                </button>
              </div>
            </div>
          ))}

          {getFilteredPeople().length === 0 && (
            <div className="empty-state">
              <h3 className="empty-state-title">No people found</h3>
              <p className="empty-state-text">
                Try adjusting your search or filters to find more people.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPeopleScreen;
