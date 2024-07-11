import React from 'react';
import './Loader.css'; // Make sure to create this CSS file

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <p className="loader-text">Loading....<span id="lol"></span></p>
      </div>
    </div>
  );
};

export default Loader;
