'use client';
import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [walletHash, setWalletHash] = useState('');
  const [isValidHash, setIsValidHash] = useState(true);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const onWalletHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWalletHash(value);
    setIsValidHash(value.startsWith('0x') && value.length === 42);// check if the hash is valid - a soft check not connected to any blockchain
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidHash) {
      alert('Please enter a valid Ethereum hash.');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('walletHash', walletHash);
    try {
      const response = await axios.post('http://localhost:3001/upload', formData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modified.wav');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error); 
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" onChange={onFileChange} />
      <input type="text" value={walletHash} onChange={onWalletHashChange} placeholder="Enter wallet hash" />
      {!isValidHash && <p style={{ color: 'red' }}>Please enter a valid Ethereum hash.</p>}
      <button type="submit">Save</button>
    </form>
  );
};

export default UploadForm;
