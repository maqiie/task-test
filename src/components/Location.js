import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from 'leaflet';

// Import Tailwind CSS styles
import 'tailwindcss/tailwind.css';

// Custom marker icon
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ location, setLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(location || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const fetchLocations = async () => {
        setLoading(true);
        try {
          // Replace with your location search API
          const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: searchTerm, format: 'json' }
          });
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLocations();
    } else {
      setLocations([]);
    }
  }, [searchTerm]);

  const handleSelectLocation = (loc) => {
    const location = {
      lat: loc.lat || loc.lat,
      lon: loc.lon || loc.lon,
      display_name: loc.display_name || loc.display_name,
    };
    setSelectedLocation(location);
    setLocation(location); // Set the selected location in the parent component
    setSearchTerm(''); // Clear the search term
    setLocations([]); // Clear search results
  };

  const MapEvents = ({ onLocationSelect }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lon: lng });
      },
    });
    return null;
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <input
        type="text"
        placeholder="Search locations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {loading && <div className="text-gray-500 mb-4">Loading...</div>}
      {locations.length > 0 && (
        <ul className="border border-gray-300 rounded bg-white shadow-md mb-4 max-h-60 overflow-y-auto">
          {locations.map((loc) => (
            <li
              key={loc.place_id}
              onClick={() => handleSelectLocation(loc)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {loc.display_name}
            </li>
          ))}
        </ul>
      )}
      {!loading && locations.length === 0 && searchTerm && (
        <div className="text-gray-500">No locations found</div>
      )}
      <div className="relative h-80">
        <MapContainer
          center={selectedLocation.lat ? [selectedLocation.lat, selectedLocation.lon] : [51.505, -0.09]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation.lat && selectedLocation.lon && (
            <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={markerIcon}>
              <Popup>{selectedLocation.display_name || 'Selected Location'}</Popup>
            </Marker>
          )}
          <MapEvents onLocationSelect={(loc) => {
            const location = { lat: loc.lat, lon: loc.lon, display_name: 'Selected Location' };
            setSelectedLocation(location);
            setLocation(location);
          }} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
