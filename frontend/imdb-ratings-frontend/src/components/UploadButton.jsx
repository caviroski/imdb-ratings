import React, { useRef, useState } from 'react';

import Button from '@mui/material/Button';

import SnackbarMessage from './SnackbarMessage';

const UploadButton = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [snack, setSnack] = useState({ open: false, message: '' });

  const showSnack = (message, color) => {
    setSnack({ open: true, message, color });
  };

  const handleClose = () => {
    setSnack({ ...snack, open: false });
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name.toLowerCase();
      const isCsv = fileName.endsWith('.csv') || file.type === 'text/csv';

      if (!isCsv) {
        showSnack('Please upload a valid CSV file.', '#0d21bfff');
        event.target.value = '';
        return;
      }

      const name = fileName.replace(/\.csv$/i, '');
      if (!isValidDate(name)) {
        showSnack('Please upload file with valid date format dd.mm.yyyy.', '#adb4eeff');
        event.target.value = '';
        return;
      }

      console.log('CSV File:', file);

      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:8080/api/imdb-ratings/upload', {
        method: 'POST',
        body: formData,
      }).then((res) => {
        if (!res.ok) throw new Error('Upload failed');
        return res.text();
      }).then((data) => {
        console.log('Upload success:', data);
        showSnack('Upload successful!', '#44bd32');
        onUploadSuccess && onUploadSuccess();
      }).catch((err) => {
        showSnack('Upload failed.', '#e74c3c');
      });
    }
  };

  function isValidDate(dateString) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const [day, month, year] = dateString.split('.').map(Number);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      <Button variant="contained" onClick={onButtonClick}>
        Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        data-testid="file-input"
      />
      <SnackbarMessage
        open={snack.open}
        message={snack.message}
        onClose={handleClose}
        backgroundColor={snack.color}
        data-testid="snackbar"
      />
    </div>
  );
};

export default UploadButton;
