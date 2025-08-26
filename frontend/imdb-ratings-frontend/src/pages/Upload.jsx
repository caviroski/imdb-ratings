import React, { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import UploadButton from '../components/UploadButton';
import { fetchDates } from '../api/fetchDates';
import { fetchFillCountries } from '../api/fetchFillCountries';

export default function Upload() {
  const [sortedDates, setSortedDates] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDates(setSortedDates);
  }, []);

  const clickDeleteButton = (fileName) => {
    console.log('Delete button clicked ', fileName);

    if (!window.confirm(`Are you sure you want to delete entries from ${fileName}?`)) return;

    fetch(`http://localhost:8080/api/imdb-ratings/delete-by-file/${fileName}`, {
      method: 'DELETE'
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to delete');
      }
        return res.text();
    }).then((msg) => {
      console.log('Deleted:', msg);
      alert(msg); // or use a snackbar

      // ✅ Refresh the list of dates after deletion
      fetchDates(setSortedDates);
    }).catch((err) => {
      console.error('Error deleting:', err);
      alert('Failed to delete entry.');
    });
  };

  const handleFillCountries = () => {
    fetchFillCountries(setMessage);
  };

  return (
    <div>
      <UploadButton onUploadSuccess={() => fetchDates(setSortedDates)} />

        <div className="p-4">
      <button
        onClick={handleFillCountries}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {"Fill Missing Countries"}
      </button>

      {message && (
        <p className="mt-4 text-gray-800">
          {message}
        </p>
      )}
    </div>

      <List sx={{ width: '100%', maxWidth: 200, bgcolor: '#2add8cff', paddingTop: '0', paddingBottom: '0', margin: '20px auto 0 auto' }}>
        {sortedDates.map((value) => (
          <ListItem
          style={{ borderBottom: '1px solid #ccc' }}
            key={value}
            secondaryAction={
              <IconButton aria-label="delete" onClick={() => clickDeleteButton(value)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${value}`} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}