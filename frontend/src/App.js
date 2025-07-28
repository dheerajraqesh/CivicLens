// frontend/src/App.js
import React, { useState} from 'react';
import ComplaintForm from './components/ComplaintForm';
import ComplaintMap from './components/ComplaintMap';
import './App.css';

import Login from './components/Login';
import Signup from './components/Signup';
import GovDashboard from './components/GovDashboard';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import ProfileView from './components/ProfileView';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }); // { username, type }
  const [showSignup, setShowSignup] = useState(false);
  const [profile, setProfile] = useState(null);

  const [page, setPage] = useState('main'); // 'main', 'profileView', ...

  const handleMapClick = (lat, lng) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  };

  const handleLogin = async (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    // Fetch profile from backend
    try {
      const res = await window.axios.get(`http://localhost:5000/api/users/${userInfo.username}`);
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  };

  const handleProfileComplete = async (profileData) => {
    try {
      await window.axios.patch(`http://localhost:5000/api/users/${user.username}`, profileData);
      // Re-fetch profile
      const res = await window.axios.get(`http://localhost:5000/api/users/${user.username}`);
      setProfile(res.data);
    } catch (err) {
      alert('Failed to save profile');
    }
  };


  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('user');
  };


  if (!user) {
    if (showSignup) {
      return <Signup onSignupSuccess={() => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  if (user && user.type === 'gov') {
    if (!profile || !profile.completed) {
      return <Profile user={user} onComplete={handleProfileComplete} onLogout={handleLogout} />;
    }
    return (
      <>
        <NavBar user={user} onLogout={handleLogout} onNav={setPage} />
        {page === 'profileView' ? (
          <ProfileView username={user.username} onBack={() => setPage('main')} />
        ) : (
          <GovDashboard govId={user.username} />
        )} 
      </>
    );
  }

  if (!profile || !profile.fullName || !profile.phone || !profile.address || (user.type === 'gov' && (!profile.department || !profile.organization))) {
    return <Profile user={user} onComplete={handleProfileComplete} onLogout={handleLogout} />;
  }
  return (
    <div className="App">
      <NavBar user={user} onLogout={handleLogout} onNav={setPage} />
      {page === 'profileView' ? (
        <ProfileView username={user.username} onBack={() => setPage('main')} />
      ) : (
        <>
          <h1>CivicLens</h1>
          <p>Logged in as <b>{user.username}</b> ({user.type === 'citizen' ? 'Citizen' : 'Government Employee'})</p>
          <ComplaintForm latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} />
          <ComplaintMap onMapClick={handleMapClick} latitude={latitude} longitude={longitude} />
        </>
      )}
    </div>
  );
}

export default App;