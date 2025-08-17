import React, { useState, useEffect } from 'react';
import './ViewHangoutsScreen.css';

const ViewHangoutsScreen = ({ contract }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bounties, setBounties] = useState([]);

  useEffect(() => {
    // Load bounties from localStorage
    const storedBounties = JSON.parse(localStorage.getItem('bounties') || '[]');
    setBounties(storedBounties);
  }, []);

  // Remove all hangouts, only show bounties
  // Remove all hangouts, only show bounties
  const hangouts = [];

  const filters = ['All', 'Technical', 'Creative', 'Research', 'Other'];

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

  const handleApplyForBounty = async (bountyId) => {
    console.log('Applying for bounty:', bountyId);
    const createTX = await contract.acceptBounty(1);
    await createTX.wait();
    console.log(createTX);
    // In a real app, this would make an API call to apply for the bounty
    // For now, we'll just add the user to the applicants list
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"email": "user@example.com"}');
    const updatedBounties = bounties.map(bounty => {
      if (bounty.id === bountyId) {
        const applicants = bounty.applicants || [];
        if (!applicants.includes(currentUser.email)) {
          return { ...bounty, applicants: [...applicants, currentUser.email] };
        }
      }
      return bounty;
    });
    setBounties(updatedBounties);
    localStorage.setItem('bounties', JSON.stringify(updatedBounties));
    alert(`Applied for bounty: ${bounties.find(b => b.id === bountyId)?.title}!`);
  };

  return (
    <div className="bounties-container">
      <div className="bounties-content">
        <div className="bounties-header">
          <h1 className="bounties-title">Available Bounties</h1>
          <input
            className="search-input"
            type="text"
            placeholder="Search bounties..."
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

        <div className="bounties-list">
          {filteredHangouts.map((bounty) => {
            const applicantCount = bounty.applicants ? bounty.applicants.length : 0;
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"email": "user@example.com"}');
            const hasApplied = bounty.applicants && bounty.applicants.includes(currentUser.email);
            const isOwner = bounty.owner === currentUser.email;
            
            return (
              <div key={bounty.id} className="bounty-card">
                <div className="card-header">
                  <h3 className="bounty-title">{bounty.title}</h3>
                  <span 
                    className="status-badge bounty-badge"
                    style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}
                  >
                    💰 Bounty
                  </span>
                </div>
                
                <p className="bounty-description">{bounty.description}</p>
                
                <div className="bounty-rewards">
                  {bounty.reward && (
                    <div className="reward-info">
                      <span className="reward-label">Reward:</span>
                      <span className="reward-value">{bounty.reward} FLOW</span>
                    </div>
                  )}
                  {bounty.stakeAmount && (
                    <div className="stake-info">
                      <span className="stake-label">Stake Required:</span>
                      <span className="stake-value">{bounty.stakeAmount} FLOW</span>
                    </div>
                  )}
                </div>
                
                <div className="bounty-details">
                  {bounty.deadline && (
                    <div className="detail-row">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-text">
                        Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {bounty.category && (
                    <div className="detail-row">
                      <span className="detail-icon">🏷️</span>
                      <span className="detail-text">{bounty.category}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{applicantCount} applicants</span>
                  </div>
                  {bounty.owner && (
                    <div className="detail-row">
                      <span className="detail-icon">�</span>
                      <span className="detail-text">Owner: {bounty.owner}</span>
                    </div>
                  )}
                </div>

                {!isOwner && (
                  <button 
                    className={`btn ${hasApplied ? 'btn-applied' : 'btn-bounty'} join-button`}
                    onClick={() => !hasApplied && handleApplyForBounty(bounty.id)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? 'Applied ✓' : 'Apply for Bounty'}
                  </button>
                )}
                {isOwner && (
                  <div className="owner-badge">
                    <span>🏠 Your Bounty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredHangouts.length === 0 && (
          <div className="empty-state">
            <h3>No bounties found</h3>
            <p>Try posting a bounty or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHangoutsScreen;
