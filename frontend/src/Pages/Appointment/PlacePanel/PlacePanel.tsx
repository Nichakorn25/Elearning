import { useState } from 'react';
import './PlacePanel.css';

const PlacePanel = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <div>
      {/* ปุ่มสำหรับเปิด/ปิดแผนที่ */}
      <button className="toggle-map-btn" onClick={toggleMapVisibility}>
        {isMapVisible ? 'Close Map' : 'Open Map'}
      </button>

      {/* แผนที่ */}
      <div className={`map-container ${isMapVisible ? 'visible' : ''}`}>
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.123456789123!2d102.456789!3d14.567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0000000000000000%3A0x000000000000000!2sSuranaree%20University%20of%20Technology!5e0!3m2!1sen!2sth!4v1680000000000!5m2!1sen!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default PlacePanel;
