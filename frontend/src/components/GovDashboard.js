import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './GovDashboard.css';

const GovDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.9412, 77.5661]);

  // Helper component to center map when mapCenter changes
  function MapCenterer({ center }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 17, { animate: true });
    }, [center, map]);
    return null;
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load complaints');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}`, { status: newStatus });
      if (newStatus === 'success') {
        // Move to completed collection
        await axios.post('http://localhost:5000/api/completed', complaints.find(c => c._id === id));
        await axios.delete(`http://localhost:5000/api/complaints/${id}`);
      }
      fetchComplaints();
    } catch (err) {
      setError('Failed to update status');
    }
    setUpdating(false);
  };

  return (
    <div className="gov-dashboard">
      <h2>All Complaints</h2>
      {loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : null}
      <div className="dashboard-content">
        <div className="complaints-list">
          {complaints.map(complaint => {
            const isPending = complaint.status === 'pending' || complaint.status === 'Pending';
            const isExpanded = selectedId === complaint._id;
            return (
              <div key={complaint._id} className="complaint-item" style={{ cursor: isPending ? 'pointer' : 'default' }}>
                <div
                  onClick={() => {
                    if (isPending) {
                      setSelectedId(isExpanded ? null : complaint._id);
                      if (!isExpanded) {
                        setMapCenter([complaint.location.coordinates[1], complaint.location.coordinates[0]]);
                      }
                    }
                  }}
                  style={{ fontWeight: isExpanded ? 'bold' : 'normal' }}
                >
                  <b>{complaint.category}</b> - {complaint.description}
                  <br/>
                  <span>Status: {complaint.status}</span>
                  {isPending && <span style={{ color: '#1976d2', marginLeft: 8 }}>[Click to expand]</span>}
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 6, fontSize: 14, color: '#333' }}>
                    <div>Latitude: {complaint.location.coordinates[1]}</div>
                    <div>Longitude: {complaint.location.coordinates[0]}</div>
                  </div>
                )}
                <button disabled={updating} onClick={() => handleStatusChange(complaint._id, 'pending')}>Pending</button>
                <button disabled={updating} onClick={() => handleStatusChange(complaint._id, 'in progress')}>In Progress</button>
                <button disabled={updating} onClick={() => handleStatusChange(complaint._id, 'success')}>Success</button>
              </div>
            );
          })}
        </div>
        <div className="dashboard-map">
          <MapContainer
            center={mapCenter}
            zoom={17}
            style={{ height: '500px', width: '100%' }}
          >
            <MapCenterer center={mapCenter} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {complaints.map(complaint => (
              <Marker
                key={complaint._id}
                position={[complaint.location.coordinates[1], complaint.location.coordinates[0]]}
              >
                <Popup>
                  <b>{complaint.category}</b><br />
                  {complaint.description}<br />
                  Status: {complaint.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default GovDashboard;
