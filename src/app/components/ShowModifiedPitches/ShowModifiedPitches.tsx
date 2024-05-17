import React, { useState } from 'react';
import styles from './ShowModifiedPitches.module.css';

const PitchesDisplay = ({ pitches }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button className={styles.pitchButton} onClick={handleClick}>
        {isVisible ? 'Hide Pitches' : 'Show Pitches'}
      </button>
      {isVisible && (
        <div className={styles.displayPitch}>
          {pitches.map((item, index) => (
            <div key={index} className={styles.pitchItem}>
              <h3>Second: {item.id * 5}</h3>
              <p>Pitch: {item.pitch}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PitchesDisplay;
