import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileView = ({ username, onBack }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${username}`);
        setProfile(res.data);
      } catch (err) {
        setError('Could not load profile');
      }
    }
    fetchProfile();
  }, [username]);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-view-container">
      <button style={{ float: 'right', margin: 10 }} onClick={onBack}>Back</button>
      <h2>My Profile</h2>
      <div><b>Username:</b> {profile.username}</div>
      <div><b>Full Name:</b> {profile.fullName}</div>
      <div><b>Phone:</b> {profile.phone}</div>
      <div><b>Address:</b> {profile.address}</div>
      <div><b>Age:</b> {profile.age}</div>
      {profile.type === 'gov' && (
        <>
          <div><b>Department:</b> {profile.department}</div>
          <div><b>Organization:</b> {profile.organization}</div>
        </>
      )}
      <div><b>Email:</b> {profile.email}</div>
      <div><b>Role:</b> {profile.type === 'gov' ? 'Government Employee' : 'Citizen'}</div>
    </div>
  );
};

export default ProfileView;
