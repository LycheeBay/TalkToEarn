import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = () => {
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

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

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
