import { API_BASE_URL } from '../config/api';

export const fetchGenreStats = async (setDataset, fromDate) => {
  try {
    const url = fromDate
      ? `${API_BASE_URL}/genre-stats?cutoffDate=${encodeURIComponent(fromDate)}`
      : `${API_BASE_URL}/genre-stats`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch genre stats');
    }

    const data = await response.json();
    setDataset(data);
  } catch (err) {
    console.error('Error fetching genre stats:', err);
    throw err;
  }
};
