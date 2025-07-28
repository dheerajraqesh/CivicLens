import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username) {
      setError('Please enter username');
      return;
    }
    if (!password) {
      setError('Please enter password');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      setError('');
      onLogin(data);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: 10 }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} style={{ background: 'none', color: '#1976d2', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
