import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BountyScreen.css';

const BountyScreen = ({ contract }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    stakeAmount: '',
    category: 'general',
    deadline: '',
    location: '',
    requirements: '',
    maxParticipants: '',
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'tech', label: 'Technology' },
    { value: 'creative', label: 'Creative' },
    { value: 'fitness', label: 'Fitness & Sports' },
    { value: 'education', label: 'Education' },
    { value: 'community', label: 'Community Service' },
    { value: 'business', label: 'Business & Networking' },
  ];

  const handleInputChange =  (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.reward.trim() || !formData.stakeAmount.trim()) {
      alert('Please fill in all required fields (Title, Description, Reward, and Stake Amount)');
      return;
    }

    // Validate that stake amount is a positive number
    const stakeAmount = parseFloat(formData.stakeAmount);
    const rewardAmount = parseFloat(formData.reward);
    
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      alert('Stake amount must be a positive number');
      return;
    }
    
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      alert('Reward amount must be a positive number');
      return;
    }

    // Create bounty object with ownership
    const currentUserEmail = 'john.doe@example.com'; // In real app, get from auth context
    const newBounty = {
      id: Date.now(),
      ...formData,
      owner: currentUserEmail,
      applicants: [],
      createdAt: new Date().toISOString(),
      status: 'active',
      type: 'bounty'
    };

    // Store in bounties localStorage
    const existingBounties = JSON.parse(localStorage.getItem('bounties') || '[]');
    const updatedBounties = [newBounty, ...existingBounties];
    localStorage.setItem('bounties', JSON.stringify(updatedBounties));
    
    const createTX = await contract.createBounty(formData.category, formData.description, 1, formData.reward);
    await createTX.wait();
    console.log(createTX);

    alert(`Bounty posted successfully! ${stakeAmount} ETH has been staked.`);
    navigate('/app/bounties');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bounty-container">
      <div className="bounty-content">
        <div className="bounty-header">
          <h1 className="bounty-title">Post a Bounty</h1>
          <p className="bounty-subtitle">Create a bounty event for others to join and earn rewards</p>
        </div>

        <form className="bounty-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Event Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Help with coding project"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe what you need help with and what participants will do..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Reward (ETH) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="form-input"
                placeholder="e.g., 0.1"
                value={formData.reward}
                onChange={(e) => handleInputChange('reward', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Stake Amount (ETH) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="form-input"
                placeholder="e.g., 0.05"
                value={formData.stakeAmount}
                onChange={(e) => handleInputChange('stakeAmount', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 5"
                min="1"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="datetime-local"
              className="form-input"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Online, Coffee shop on 5th Ave, etc."
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea
              className="form-textarea"
              placeholder="Any specific skills, tools, or requirements participants should have..."
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Post Bounty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BountyScreen;
