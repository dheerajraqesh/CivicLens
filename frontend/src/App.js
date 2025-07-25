// frontend/src/App.js
import React, { useState } from 'react';
import ComplaintForm from './components/ComplaintForm';
import ComplaintMap from './components/ComplaintMap';
import './App.css';

import Login from './components/Login';
import Signup from './components/Signup';
import GovDashboard from './components/GovDashboard';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [user, setUser] = useState(null); // { username, type }
  const [showSignup, setShowSignup] = useState(false);

  const handleMapClick = (lat, lng) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  if (!user) {
    if (showSignup) {
      return <Signup onSignupSuccess={() => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  if (user && user.type === 'gov') {
    return <GovDashboard />;
  }

  return (
    <div className="App">
      <h1>CivicLens</h1>
      <p>Logged in as <b>{user.username}</b> ({user.type === 'citizen' ? 'Citizen' : 'Government Employee'})</p>
      <ComplaintForm latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} />
      <ComplaintMap onMapClick={handleMapClick} latitude={latitude} longitude={longitude} />
    </div>
  );
}

export default App;