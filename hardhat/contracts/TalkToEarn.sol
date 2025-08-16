// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TalkToEarn
 * @dev A platform where users can post bounties to incentivize meaningful conversations
 */
contract TalkToEarn {
    
    struct Bounty {
        uint256 id;
        address creator;
        uint256 reward;
        string topic;
        string description;
        uint256 duration; // in minutes
        uint256 createdAt;
        bool isActive;
        bool isCompleted;
        address participant;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Conversation {
        uint256 bountyId;
        address creator;
        address participant;
        uint256 startTime;
        uint256 endTime;
        uint256 tipAmount;
        bool isCompleted;
        uint8 creatorRating; // 1-5 scale
        uint8 participantRating; // 1-5 scale
    }
    
    struct UserProfile {
        string username;
        uint256 totalEarnings;
        uint256 totalSpent;
        uint256 conversationsCompleted;
        uint256 averageRating; // scaled by 100 (e.g., 450 = 4.50)
        uint256 totalRatings;
        bool isActive;
    }
    
    // State variables
    uint256 public nextBountyId = 1;

    uint256 public nextConversationId = 1;
    uint256 public platformFeePercentage = 250; // 2.5% (scaled by 100)
    uint256 public minimumBountyAmount = 0.001 ether;
    uint256 public maximumDuration = 240; // 4 hours in minutes
    address public owner;
    
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Conversation) public conversations;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userBounties;
    mapping(address => uint256[]) public userConversations;
    
    uint256[] public activeBountyIds;
    
    // Events
    event BountyCreated(uint256 indexed bountyId, address indexed creator, string topic);
    event BountyAccepted(uint256 indexed bountyId, address indexed participant);
    event ConversationStarted(uint256 indexed conversationId, uint256 indexed bountyId, address indexed creator, address participant);
    event ConversationCompleted(uint256 indexed conversationId, uint256 tipAmount);
    event TipSent(address indexed from, address indexed to, uint256 amount, uint256 conversationId);
    event UserRated(address indexed user, uint8 rating, uint256 conversationId);
    event BountyCancelled(uint256 indexed bountyId);
    event PlatformFeeUpdated(uint256 newFeePercentage);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }
    
    modifier bountyExists(uint256 _bountyId) {
        require(_bountyId > 0 && _bountyId < nextBountyId, "Bounty does not exist");
        _;
    }
    
    modifier onlyBountyCreator(uint256 _bountyId) {
        require(bounties[_bountyId].creator == msg.sender, "Not the bounty creator");
        _;
    }
    
    /**
     * @dev Create a new bounty for conversation
     */
    function createBounty(
        string memory _topic,
        string memory _description,
        uint256 _duration,
        uint256 _amount
    ) external {
        require(_duration > 0 && _duration <= maximumDuration, "Invalid duration");
        require(bytes(_topic).length > 0, "Topic cannot be empty");
        
        uint256 bountyId = nextBountyId++;
        
        bounties[bountyId] = Bounty({
            id: bountyId,
            creator: msg.sender,
            reward: _amount,
            topic: _topic,
            description: _description,
            duration: _duration,
            createdAt: block.timestamp,
            isActive: true,
            isCompleted: false,
            participant: address(0),
            startTime: 0,
            endTime: 0
        });
        
        userBounties[msg.sender].push(bountyId);
        activeBountyIds.push(bountyId);
        
        emit BountyCreated(bountyId, msg.sender, _topic);
    }
    
    /**
     * @dev Accept a bounty and start conversation
     */
    function acceptBounty(uint256 _bountyId) 
        external  
        bountyExists(_bountyId) 
    {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(bounty.creator != msg.sender, "Cannot accept own bounty");
        require(bounty.participant == address(0), "Bounty already accepted");
        
        bounty.participant = msg.sender;
        bounty.startTime = block.timestamp;
        bounty.endTime = block.timestamp + (bounty.duration * 1 minutes);
        
        uint256 conversationId = nextConversationId++;
        
        conversations[conversationId] = Conversation({
            bountyId: _bountyId,
            creator: bounty.creator,
            participant: msg.sender,
            startTime: block.timestamp,
            endTime: 0,
            tipAmount: 0,
            isCompleted: false,
            creatorRating: 0,
            participantRating: 0
        });
        
        userConversations[bounty.creator].push(conversationId);
        userConversations[msg.sender].push(conversationId);
        
        // Remove from active bounties
        _removeFromActiveBounties(_bountyId);
        
        emit BountyAccepted(_bountyId, msg.sender);
        emit ConversationStarted(conversationId, _bountyId, bounty.creator, msg.sender);
    }
    
    /**
     * @dev Complete a conversation and distribute rewards
     */
    function completeConversation(uint256 _conversationId) 
        external  
    {
        Conversation storage conversation = conversations[_conversationId];
        require(
            msg.sender == conversation.creator || msg.sender == conversation.participant,
            "Not authorized"
        );
        
        Bounty storage bounty = bounties[conversation.bountyId];
        
        conversation.isCompleted = true;
        conversation.endTime = block.timestamp;
        bounty.isCompleted = true;
        bounty.isActive = false;
        
        // Calculate platform fee
        uint256 platformFee = (bounty.reward * platformFeePercentage) / 10000;
        uint256 participantReward = bounty.reward - platformFee;
        
        // Update user profiles
        userProfiles[conversation.participant].totalEarnings += participantReward;
        userProfiles[conversation.creator].totalSpent += bounty.reward;
        userProfiles[conversation.participant].conversationsCompleted++;
        userProfiles[conversation.creator].conversationsCompleted++;
        
        emit ConversationCompleted(_conversationId, participantReward);
    }
    
    /**
     * @dev Send additional tip during or after conversation
     */
    function sendTip(uint256 _conversationId, address _participant) 
        external 
        payable 
    {
        require(msg.value > 0, "Tip amount must be greater than 0");
        
        Conversation storage conversation = conversations[_conversationId];
        
        conversation.tipAmount += msg.value;
        userProfiles[_participant].totalEarnings += msg.value;
        userProfiles[msg.sender].totalSpent += msg.value;
        
        payable(_participant).transfer(msg.value);
        
        emit TipSent(msg.sender, conversation.participant, msg.value, _conversationId);
    }
    
    /**
     * @dev Rate a user after conversation
     */
    function rateUser(uint256 _conversationId, uint8 _rating) 
        external 
    {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        Conversation storage conversation = conversations[_conversationId];
        require(conversation.isCompleted, "Conversation must be completed");
        require(
            msg.sender == conversation.creator || msg.sender == conversation.participant,
            "Not authorized to rate"
        );
        
        address userToRate;
        if (msg.sender == conversation.creator) {
            require(conversation.creatorRating == 0, "Already rated");
            conversation.creatorRating = _rating;
            userToRate = conversation.participant;
        } else {
            require(conversation.participantRating == 0, "Already rated");
            conversation.participantRating = _rating;
            userToRate = conversation.creator;
        }
        
        // Update user's average rating
        UserProfile storage profile = userProfiles[userToRate];
        uint256 totalRating = (profile.averageRating * profile.totalRatings) + (_rating * 100);
        profile.totalRatings++;
        profile.averageRating = totalRating / profile.totalRatings;
        
        emit UserRated(userToRate, _rating, _conversationId);
    }
    
    /**
     * @dev Cancel an active bounty (only creator)
     */
    function cancelBounty(uint256 _bountyId) 
        external 
        bountyExists(_bountyId) 
        onlyBountyCreator(_bountyId) 
    {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(bounty.participant == address(0), "Cannot cancel accepted bounty");
        
        bounty.isActive = false;
        _removeFromActiveBounties(_bountyId);
        
        payable(msg.sender).transfer(bounty.reward);
        
        emit BountyCancelled(_bountyId);
    }
    
    /**
     * @dev Update user profile
     */
    function updateProfile(string memory _username) external {
        userProfiles[msg.sender].username = _username;
        userProfiles[msg.sender].isActive = true;
    }
    
    /**
     * @dev Get active bounties
     */
    function getActiveBounties() external view returns (uint256[] memory) {
        return activeBountyIds;
    }
    
    /**
     * @dev Get user's bounties
     */
    function getUserBounties(address _user) external view returns (uint256[] memory) {
        return userBounties[_user];
    }
    
    /**
     * @dev Get user's conversations
     */
    function getUserConversations(address _user) external view returns (uint256[] memory) {
        return userConversations[_user];
    }
    
    /**
     * @dev Get bounty details
     */
    function getBounty(uint256 _bountyId) external view returns (Bounty memory) {
        return bounties[_bountyId];
    }
    
    /**
     * @dev Get conversation details
     */
    function getConversation(uint256 _conversationId) external view returns (Conversation memory) {
        return conversations[_conversationId];
    }
    
    /**
     * @dev Emergency function to extend conversation time (only owner)
     */
    function extendConversation(uint256 _bountyId, uint256 _additionalMinutes) 
        external 
        bountyExists(_bountyId) 
    {
        bounties[_bountyId].endTime += (_additionalMinutes * 1 minutes);
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercentage) external {
        require(_newFeePercentage <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercentage = _newFeePercentage;
        emit PlatformFeeUpdated(_newFeePercentage);
    }
    
    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external {
        payable(owner).transfer(address(this).balance);
    }
    

    // Internal functions
    function _removeFromActiveBounties(uint256 _bountyId) internal {
        for (uint256 i = 0; i < activeBountyIds.length; i++) {
            if (activeBountyIds[i] == _bountyId) {
                activeBountyIds[i] = activeBountyIds[activeBountyIds.length - 1];
                activeBountyIds.pop();
                break;
            }
        }
    }
    
    receive() external payable {}
}