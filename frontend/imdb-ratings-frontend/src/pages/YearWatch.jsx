import { useState, useEffect } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import SelectDate from '../components/SelectDate';
import SnackbarMessage from '../components/SnackbarMessage';
import { fetchDates } from '../api/fetchDates';
import { fetchYearCount } from '../api/fetchYearCount';

export default function YearWatch() {
  const [date, setDate] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [total, setTotal] = useState(0);
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    const loadDates = async () => {
      try {
        await fetchDates(setDate);
        await fetchYearCount(setDataset, setTotal, '');
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

  const optionsBackend = date.map(d => ({
    label: d,
    value: d
  }));

  const [options, setOptions] = useState([...optionsBackend]);
  const [fromDate, setFromDate] = useState('');

  const handleChange = (event) => {
    const selectedDate = event.target.value;
    setFromDate(selectedDate);
    fetchYearCount(setDataset, setTotal, selectedDate);
  };

  const handleCloseSnackbar = () => {
    setSnack({ ...snack, open: false });
  };

  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        How many enteries are watched from every year shown in linear graph.
      </p>
      <p style={{ marginBottom: '50px', textAlign: 'center' }}>
        Total watched: { total } items
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
          onChange={handleChange}
          label="Pick Date"
          options={options}
        />
      </div>

      <div
        style={{
          marginTop: '20px'
        }}
      >
        <BarChart
          dataset={dataset}
          xAxis={[{ 
            height: 40,
            scaleType: 'band',
            dataKey: 'year',
            tickLabelStyle: { angle: 90, fontSize: 12 },
            tickLabelInterval: () => true,
            valueFormatter: (v) => { return v }
          }]}
          yAxis={[{ position: 'none' }]}
          series={[{ dataKey: 'itemsNum', valueFormatter: (v) => { return v } }]}
          layout="vertical"
          height={300}
          onItemClick={(event, item) => {
            if (item?.dataIndex !== undefined) {
              const clickedYear = dataset[item.dataIndex]?.year;
              const url = `https://www.imdb.com/search/title/?release_date=${clickedYear}-01-01,${clickedYear}-12-31&my_ratings=restrict&count=250`;
              window.open(url, '_blank');
            }
          }}
        />
      </div>
      <SnackbarMessage
        open={snack.open}
        message={snack.message}
        onClose={handleCloseSnackbar}
        backgroundColor={snack.color}
        duration={snack.duration}
      />
    </div>
  )
}
