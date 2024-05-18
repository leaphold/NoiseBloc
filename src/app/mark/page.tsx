'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkSound from '../components/MarkSound/MarkSound';
import PitchesDisplay from '../components/ShowModifiedPitches/ShowModifiedPitches';
import styles from './mark.module.css';

interface Pitch {
  id: number;
  pitch: number;
}

function Watermark() {
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    setPitches([]); 
    // Clear the pitches on the server
    const clearPitches = async () => {
      try {
        await axios.get('http://localhost:3001/clear_pitches');
      } catch (error) {
        console.error(error);
      }
    };

    clearPitches();
  }, []);

  return (
    <div className={styles.markContainer}>
      <h1>Make your mark on the NoiseBloc</h1>
      <p>Upload your sound file and mark it with a NoiseBloc</p>

      <MarkSound setPitches={setPitches} />
      <PitchesDisplay pitches={pitches} />
    </div>
  );
};

export default Watermark;
