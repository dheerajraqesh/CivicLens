// frontend/src/components/ComplaintMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customMarker = new L.Icon({
  iconUrl: '/map-marker.png',
  iconSize: [80, 80],
  iconAnchor: [40, 80],
  popupAnchor: [0, -80],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null
});

function MapClickHandler({ onMapClick, clickedPosition }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return clickedPosition ? (
    <Marker position={clickedPosition} icon={customMarker}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
}

const ComplaintMap = ({ onMapClick }) => {
  const [complaints, setComplaints] = useState([]);
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComplaints();
  }, []);

  const handleMapClick = (lat, lng) => {
    setClickedPosition([lat, lng]);
    onMapClick(lat, lng);
  };

  return (
    <MapContainer center={[12.9412, 77.5661]} zoom={17} maxZoom={23} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={23}
      />
      <MapClickHandler onMapClick={handleMapClick} clickedPosition={clickedPosition} />
      {complaints.map((complaint) => (
        <Marker
          key={complaint._id}
          position={[complaint.location.coordinates[1], complaint.location.coordinates[0]]}
          icon={customMarker}
        >
          <Popup>
            <b>{complaint.category}</b><br />
            {complaint.description}<br />
            Status: {complaint.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ComplaintMap;