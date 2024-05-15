import React from 'react';
import MarkSound from '../components/MarkSound/MarkSound';
import styles from './mark.module.css';
function Watermark(){

  return (
    <div className={styles.container}>
      <h1>Make your make on the NoiseBloc</h1>
      <p>Upload your sound file and mark it with a NoiseBloc</p>

     <MarkSound /> 

    </div>
  );
};

export default Watermark;

