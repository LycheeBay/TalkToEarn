import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginScreen.css';
import { ethers } from 'ethers';

import TalkToEarn from "../artifacts/contracts/TalkToEarn.sol/TalkToEarn.json";

// const TALKTOEARN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TALKTOEARN_ADDRESS = "0x957c6768d90afE4c251adE17F5074CCea3fF448B";

const LoginScreen = ({ setETHAddress, setUserSigner, setContract }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation - accept any email/password combination for now
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // For now, any valid email/password combo will log in
    if (email.includes('@') && password.length >= 1) {
      alert('Logged in successfully!');
      navigate('/app');
    } else {
      alert('Please enter a valid email address');
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();

        const newContract = new ethers.Contract(TALKTOEARN_ADDRESS, TalkToEarn.abi, signer);

        setContract(newContract);
        setUserSigner(signer);
        setETHAddress(address);
        navigate('/app');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

         <button className="btn btn-primary login-button" onClick={(connectWallet)}>
            Connect with Wallet
          </button>

          <br />

          <center>
          <p>Or</p>
          </center>
         

        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-primary login-button">
            Sign In
          </button>

          <div className="signup-link">
            <span className="signup-text">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-text-bold">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
