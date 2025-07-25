import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [role, setRole] = useState('citizen');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
        type: role,
      });
      setSuccess('Signup successful! Please login.');
      setUsername(''); setEmail(''); setPassword('');
      setTimeout(() => { onSignupSuccess(); }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="citizen">Citizen</option>
            <option value="gov">Government Employee</option>
          </select>
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 8 chars, uppercase, lowercase, number, special char" />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div style={{ color: '#1976d2', marginBottom: 6 }}>{success}</div>}
        <button type="submit">Sign Up</button>
      </form>
      <div style={{ marginTop: 10 }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', color: '#1976d2', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Login</button>
      </div>
    </div>
  );
};

export default Signup;
