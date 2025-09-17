import { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import SelectDate from '../components/SelectDate';
import { fetchDates } from '../api/fetchDates';
import { fetchRatingsByDate } from '../api/fetchRatingsByDate';

export default function AllData() {
  const [date, setDate] = useState([]);
  const [options, setOptions] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchDates(setDate);
  }, []);
  
  useEffect(() => {
    setOptions(date.map(d => ({ label: d, value: d })));
  }, [date]);

  const dataColumns = [
    { field: 'const', headerName: 'Const', width: 90 },
    { field: 'yourRating', headerName: 'Your Rating', width: 100 },
    { field: 'dateRated', headerName: 'Date Rated', width: 100 },
    { field: 'title', headerName: 'Title', width: 220 },
    { field: 'originalTitle', headerName: 'Original Title', width: 220 },
    { field: 'url', headerName: 'URL', width: 260 },
    { field: 'titleType', headerName: 'Title Type', width: 120 },
    { field: 'imdbRating', headerName: 'IMDb Rating', width: 100 },
    { field: 'runtime', headerName: 'Runtime (mins)', width: 120 },
    { field: 'year', headerName: 'Year', width: 60 },
    { field: 'genres', headerName: 'Genres', width: 80 },
    { field: 'numVotes', headerName: 'Num Votes', width: 120 },
    { field: 'releaseDate', headerName: 'Release Date', width: 120 },
    { field: 'directors', headerName: 'Directors', width: 150 }
  ];

  const pickDate = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    fetchRatingsByDate(setDataRows, selectedDate);
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
          data-testid="select-date"
        />
      </div>
        <div style={{ width: 1900 }}>
          <p style={{ textAlign: 'center' }}>All the data from the export</p>
          <Paper sx={{ height: 590, width: '100%' }}>
            <DataGrid
              rows={dataRows}
              columns={dataColumns}
              sx={{ border: 0 }}
              disableColumnMenu={true}
            />
          </Paper>
        </div>
    </div>
  );
}
