import { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import SelectDate from '../components/SelectDate';
import { fetchDates } from '../api/fetchDates';
import { fetchComparison } from '../api/fetchComparison';

export default function Compare() {
  const [sortedDates, setSortedDates] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDates(setSortedDates);
  }, []);

  useEffect(() => {
    setOptionsOne(optionsBackend);
    setOptionsTwo(optionsBackend);
  }, [sortedDates]);

  const optionsBackend = sortedDates.map(date => ({
    label: date,
    value: date
  }));

  const [optionsOne, setOptionsOne] = useState([...optionsBackend]);
  const [optionsTwo, setOptionsTwo] = useState([...optionsBackend]);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [firstColumnHeader, setFirstColumnHeader] = useState('Start Date');
  const [secondColumnHeader, setSecondColumnHeader] = useState('Start Date');

  const handleFromChange = (event) => {
    const selected = event.target.value;
    setFromDate(selected);
    setFirstColumnHeader(selected);
    setOptionsTwo(optionsBackend.filter(opt => opt.value !== selected));
  }
  
  const handleToChange = (event) => {
    const selected = event.target.value;
    setToDate(selected);
    setSecondColumnHeader(selected);
    setOptionsOne(optionsBackend.filter(opt => opt.value !== selected));

    if (fromDate && selected) {
      fetchComparison(fromDate, selected, search, setRows);
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchComparison(fromDate, toDate, search, setRows);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'dateRated', headerName: 'Date Rated', width: 150 },
    {
      field: 'name',
      headerName: 'Title Name',
      width: 500,
      renderCell: (params) => (
        <a
          href={params.row.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          {params.value}
        </a>
      )
    },
    { field: 'firstDate', headerName: firstColumnHeader, width: 125 },
    { field: 'secondDate', headerName: secondColumnHeader, width: 125 },
    { field: 'difference', headerName: 'Difference', width: 115 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p style={{ marginBottom: '20px', textAlign: 'center' }}>
        It will compare the number of votes for the entries.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          gap: '2rem',
        }}
      >
        <SelectDate
          value={fromDate}
          onChange={handleFromChange}
          label="Pick first Date"
          options={optionsOne}
        />
        <SelectDate
          value={toDate}
          onChange={handleToChange}
          label="Pick second Date"
          options={optionsTwo}
        />
      </div>

      <div
        style={
          { marginTop: '20px' }
        }
      >
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div style={{ width: 1100, margin: '50px auto 0 auto' }}>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            sx={{ border: 0 }}
            disableColumnMenu={true}
          />
        </Paper>
      </div>
    </div>
  );
}
