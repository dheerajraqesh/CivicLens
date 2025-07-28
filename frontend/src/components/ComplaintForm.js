// frontend/src/components/ComplaintForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = ({ latitude, longitude, setLatitude, setLongitude }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', {
        description,
        category: category === 'Other' ? customCategory : category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      alert('Complaint submitted!');
      setDescription('');
      setCategory('');
      setCustomCategory('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error(error);
      alert('Error submitting complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>File a Complaint</h2>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select</option>
          <option value="Road">Road</option>
          <option value="Garbage">Garbage</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Street Light">Street Light</option>
          <option value="Noise">Noise</option>
          <option value="Pollution">Pollution</option>
          <option value="Public Transport">Public Transport</option>
          <option value="Parks">Parks</option>
          <option value="Drainage">Drainage</option>
          <option value="Other">Other</option>
        </select>
        {category === 'Other' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter custom type"
            required
          />
        )}
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ComplaintForm;