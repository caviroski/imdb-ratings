import { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import SelectDate from '../components/SelectDate';
import { fetchDates } from '../api/fetchDates';

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
    { field: 'const', headerName: 'Const', width: 80 },
    { field: 'yourRating', headerName: 'Your Rating', width: 80 },
    { field: 'dateRated', headerName: 'Date Rated', width: 80 },
    { field: 'title', headerName: 'Title', width: 80 },
    { field: 'originalTitle', headerName: 'Original Title', width: 80 },
    { field: 'url', headerName: 'URL', width: 80 },
    { field: 'titleType', headerName: 'Title Type', width: 80 },
    { field: 'imdbRating', headerName: 'IMDb Rating', width: 80 },
    { field: 'runtime', headerName: 'Runtime (mins)', width: 80 },
    { field: 'year', headerName: 'Year', width: 80 },
    { field: 'genres', headerName: 'Genres', width: 80 },
    { field: 'numVotes', headerName: 'Num Votes', width: 80 },
    { field: 'releaseDate', headerName: 'Release Date', width: 80 },
    { field: 'directors', headerName: 'Directors', width: 80 }
  ];

  const pickDate = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
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
        <div style={{ width: 1400 }}>
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