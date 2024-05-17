'use client';
import styles from './mark.module.css';
import axios, { AxiosResponse } from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react';

interface Props {
  setPitches: (pitches: any) => void;
}

const UploadForm: React.FC<Props> = ({ setPitches }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [walletHash, setWalletHash] = useState<string>('');
  const [isValidHash, setIsValidHash] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'wav') {
        alert('Please upload a .wav file.');
        return;
      }
      setFile(file);
      setFileName(file.name);
    }
  };

  const onWalletHashChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWalletHash(value);
    setIsValidHash(value.startsWith('0x') && value.length === 42);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidHash) {
      alert('Please enter a valid Ethereum hash.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('walletHash', walletHash);
    try {
      const response: AxiosResponse = await axios.post('http://localhost:3001/upload', formData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modified.wav');
      document.body.appendChild(link);
      link.click();

      // Fetch the pitches from the server after the file upload is successful
      const pitchesResponse: AxiosResponse = await axios.get('http://localhost:3001/pitches');
      setPitches(pitchesResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.markContainer}>
      <label htmlFor="fileInput" className="fileInputLabel">
        Upload File
      </label>
      <input type="file" className='fileInput' id='fileInput' onChange={onFileChange} />
      {fileName && <p>Uploaded file: {fileName}</p>}
      <input type="text" value={walletHash} onChange={onWalletHashChange} placeholder="Enter wallet hash" />
      {!isValidHash && <p style={{ color: 'red' }}>Please enter a valid Ethereum hash.</p>}
      <button className={isLoading ? 'buttonProcessing' : 'button'} type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'NoiseBloc it!'}
      </button>
    </form>
  );
};

export default UploadForm;
