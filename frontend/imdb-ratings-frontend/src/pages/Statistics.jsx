import { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import SelectDate from '../components/SelectDate';
import SnackbarMessage from '../components/SnackbarMessage';
import { fetchDates } from '../api/fetchDates';
import { fetchYearlyAverage } from '../api/fetchYearlyAverage';
import { fetchTitleTypeCounts } from '../api/fetchTitleTypeCounts';
import { fetchGenreStats } from '../api/fetchGenreStats';

export default function Statistics() {
  const [date, setDate] = useState([]);
  const [options, setOptions] = useState([]);
  const [yearRows, setYearRows] = useState([]);
  const [titleTypeRows, setTitleTypeRows] = useState([]);
  const [genreRows, setGenreRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    const loadDates = async () => {
      try {
        await fetchDates(setDate);
      } catch (err) {
        setSnack({ open: true, message: 'Get files dates - ' + err.message, color: '#e84118' });
        setDate([]);
      }
    };
    loadDates();
  }, []);

  useEffect(() => {
    setOptions(date.map(d => ({ label: d, value: d })));
  }, [date]);

  const yearColumns = [
    { field: 'year', headerName: 'Year', width: 80 },
    { field: 'avgRating', headerName: 'Average Rating', width: 150 },
    { field: 'itemsNum', headerName: 'Count', width: 90 }
  ];

  const titleTypeColumns = [
    { field: 'titleType', headerName: 'Title Type', width: 180 },
    { field: 'count', headerName: 'Count', width: 90 }
  ];

  const genreColumns = [
    { field: 'genre', headerName: 'Genre', width: 120 },
    { field: 'count', headerName: 'Count', width: 90 },
    { field: 'avgRating', headerName: 'Average Rating', width: 150 }
  ];

  const pickDate = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    fetchYearlyAverage(setYearRows, selectedDate);
    fetchTitleTypeCounts(setTitleTypeRows, selectedDate);
    fetchGenreStats(setGenreRows, selectedDate);
  };

  const handleCloseSnackbar = () => {
    setSnack({ ...snack, open: false });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          gap: '2rem',
          marginTop: '20px'
        }}
      >
        <SelectDate
          value={selectedDate}
          onChange={pickDate}
          label="Pick Date"
          options={options}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '100px',
          marginTop: '50px'
        }}
      >
        <div style={{ width: 400 }}>
          <p style={{ textAlign: 'center' }}>Every years items average rating</p>
          <Paper sx={{ height: 590, width: '100%' }}>
            <DataGrid
              rows={yearRows}
              columns={yearColumns}
              sx={{ border: 0 }}
              disableColumnMenu={true}
            />
          </Paper>
        </div>
        <div style={{ width: 290 }}>
          <p style={{ textAlign: 'center' }}>How many items are from every type</p>
          <Paper sx={{ height: 590, width: '100%' }}>
            <DataGrid
              rows={titleTypeRows}
              columns={titleTypeColumns}
              sx={{ border: 0 }}
              disableColumnMenu={true}
            />
          </Paper>
        </div>
        <div style={{ width: 380 }}>
          <p style={{ textAlign: 'center' }}>Every genre average rating</p>
          <Paper sx={{ height: 590, width: '100%' }}>
            <DataGrid
              rows={genreRows}
              columns={genreColumns}
              sx={{ border: 0 }}
              disableColumnMenu={true}
            />
          </Paper>
        </div>
      </div>
      <SnackbarMessage
        open={snack.open}
        message={snack.message}
        onClose={handleCloseSnackbar}
        backgroundColor={snack.color}
        duration={snack.duration}
      />
    </div>
  );
}
