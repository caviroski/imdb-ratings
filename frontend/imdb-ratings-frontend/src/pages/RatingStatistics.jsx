import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import SelectDate from '../components/SelectDate';
import { fetchDates } from '../api/fetchDates';
import { fetchYearlyAverage } from '../api/fetchYearlyAverage';

export default function YearWatch() {
  const [date, setDate] = useState([]);
  const [options, setOptions] = useState([]);
  const [yearRows, setYearRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchDates(setDate);
  }, []);

  useEffect(() => {
    setOptions(date.map(d => ({ label: d, value: d })));
  }, [date]);

  const optionsBackend = date.map(d => ({
    label: d,
    value: d
  }));

  const columns = [
    { field: 'year', headerName: 'Year', width: 80 },
    { field: 'avgRating', headerName: 'Average Rating', width: 150 },
    { field: 'itemsNum', headerName: 'Count', width: 90 }
  ];

  const handleChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    fetchYearlyAverage(setYearRows, selectedDate);
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
          onChange={handleChange}
          label="Pick Date"
          options={options}
        />
      </div>

      <div style={{ width: 400, margin: '50px auto 0 auto' }}>
        <Paper sx={{ height: 590, width: '100%' }}>
          <DataGrid
            rows={yearRows}
            columns={columns}
            sx={{ border: 0 }}
            disableColumnMenu={true}
          />
        </Paper>
      </div>
    </div>
  );
}
