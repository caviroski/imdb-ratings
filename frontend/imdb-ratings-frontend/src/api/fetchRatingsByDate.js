import { API_BASE_URL } from '../config/api';

export const fetchRatingsByDate = async (setDataset, date) => {
  console.log('Fetching ratings for date:', date);
  try {
    const response = await fetch(`${API_BASE_URL}/ratings-by-date?date=${encodeURIComponent(date)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch ratings by date');
    }

    const data = await response.json();
    setDataset(data);
  } catch (err) {
    console.error('Error fetching ratings:', err);
    throw err;
  }
};
