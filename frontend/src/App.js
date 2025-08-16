import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  const [ethAddress, setETHAddress] = useState('');
  const [userSigner, setUserSigner] = useState(null);
  const [contract, setContract] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen setETHAddress={setETHAddress} setUserSigner={setUserSigner} setContract={setContract}/>} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/app/*" element={<MainLayout contract={contract} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
