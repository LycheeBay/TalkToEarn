# ChatBounty 🏆

**Empowering Real-World Connections Through Blockchain Incentives**

ChatBounty is a social platform that bridges the digital and physical worlds by leveraging the Ethereum ecosystem to incentivize real-life meetups and gatherings. Using a bounty-based reward system, ChatBounty motivates people to step away from their screens and create meaningful connections in person.

## 🌟 Vision

In an increasingly digital world, authentic human connections are becoming rare. ChatBounty addresses this challenge by creating economic incentives for people to meet face-to-face, fostering genuine relationships and building stronger communities.

## 🔗 Flow Integration

- **Smart Contracts Deployed To Flow EVM Testnet:**  
https://evm-testnet.flowscan.io/address/0x957c6768d90afE4c251adE17F5074CCea3fF448B

## 🚀 Key Features

### 🎯 Bounty System
- **Create Bounties**: Users can post bounties for specific meetup activities (coffee dates, study sessions, hobby groups, etc.)
- **Accept Challenges**: Browse and accept bounties that match your interests and location
- **Earn Rewards**: Complete meetups to earn cryptocurrency rewards and reputation points

### 📱 Mobile-First Experience
- **Home Dashboard**: View nearby bounties and trending activities
- **Hangout Discovery**: Find and join local gatherings and events
- **People Finder**: Connect with like-minded individuals in your area
- **Profile Management**: Showcase your interests, reputation, and completed bounties

### 🔗 Blockchain Integration
- **Ethereum-based**: Built on the Ethereum network for transparent and secure transactions
- **Smart Contracts**: Automated bounty escrow and reward distribution
- **Decentralized**: No central authority controlling user interactions or rewards

### 🛡️ Trust & Safety
- **Reputation System**: Build trust through successful meetup completions
- **Verification Methods**: Multiple ways to confirm meetup attendance
- **Community Moderation**: User-driven safety and quality standards

## 🏗️ Project Structure

```
ethnyc/
├── frontend/          # React Native mobile application
│   ├── src/
│   │   ├── screens/   # Main app screens (Home, Login, Profile, etc.)
│   │   ├── components/# Reusable UI components
│   │   └── navigation/# App navigation setup
│   └── package.json
├── hardhat/          # Ethereum smart contracts
│   ├── contracts/    # Solidity smart contracts
│   ├── ignition/     # Deployment scripts
│   └── hardhat.config.js
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Rapid development and deployment
- **React Navigation**: Seamless app navigation
- **Web3.js**: Ethereum blockchain interaction

### Backend & Blockchain
- **Solidity**: Smart contract development
- **Hardhat**: Ethereum development environment
- **OpenZeppelin**: Secure contract libraries
- **IPFS**: Decentralized file storage (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LycheeBay/TalkToEarn.git
   cd ethnyc
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Hardhat Dependencies**
   ```bash
   cd ../hardhat
   npm install
   ```

### Running the Application

1. **Start the Mobile App**
   ```bash
   cd frontend
   npm start
   # or
   expo start
   ```

2. **Deploy Smart Contracts (Local Development)**
   ```bash
   cd hardhat
   npx hardhat node
   # In another terminal:
   npx hardhat ignition deploy ignition/modules/TalkToEarn.js --network localhost
   ```

## 📋 Current Features

### ✅ Implemented
- Basic app navigation structure
- Login/Signup screens (mock authentication)
- Home dashboard layout
- Profile management interface
- Bounty browsing screen
- People discovery interface

### 🚧 In Development
- Ethereum wallet integration
- Smart contract deployment
- Bounty creation and management
- Geolocation services
- Push notifications

### 📅 Roadmap
- [ ] Advanced matching algorithms
- [ ] Multi-token support (ERC-20)
- [ ] DAO governance features
- [ ] Cross-chain compatibility
- [ ] Advanced reputation system
- [ ] Integration with existing social platforms

## 🤝 How It Works

1. **Create Account**: Sign up and connect your Ethereum wallet
2. **Browse Bounties**: Discover meetup opportunities in your area
3. **Post Bounties**: Create your own gatherings with reward incentives
4. **Meet & Verify**: Attend meetups and verify completion
5. **Earn Rewards**: Receive cryptocurrency rewards and build reputation
6. **Build Network**: Grow your social connections and community presence

## 🌍 Use Cases

- **Students**: Study groups, academic meetups, campus events
- **Professionals**: Networking events, skill-sharing sessions, coworking
- **Hobbyists**: Interest-based gatherings, workshops, recreational activities
- **Travelers**: Local meetups, cultural exchanges, city exploration
- **Communities**: Neighborhood events, volunteer activities, social causes

## 🔒 Security Considerations

- Smart contracts audited for common vulnerabilities
- User data encryption and privacy protection
- Decentralized architecture reduces single points of failure
- Community-driven moderation and dispute resolution

## 🤝 Contributing

We welcome contributions from developers, designers, and community members! Please check our contributing guidelines and open issues for ways to get involved.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **GitHub**: [LycheeBay/TalkToEarn](https://github.com/LycheeBay/TalkToEarn)
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord server (coming soon)

## 🙏 Acknowledgments

- Built for ETH NYC hackathon
- Inspired by the web3 community's vision of decentralized social interactions
- Thanks to all contributors and early adopters

---

**ChatBounty - Where Digital Incentives Meet Real-World Connections** 🌟
