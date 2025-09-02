import { API_BASE_URL } from '../config/api';

export const fetchYearlyAverage = async (setDataset, cutoffDate = '') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/yearly-average?cutoffDate=${encodeURIComponent(cutoffDate)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setDataset(data);
  } catch (error) {
    console.error('Error fetching yearly average ratings:', error);
  }
};
