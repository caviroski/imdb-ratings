import { API_BASE_URL } from '../config/api';

export const fetchYearCount = async (setDataset, fromDate = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/year-count?fromDate=${encodeURIComponent(fromDate)}`);
    const data = await response.json();
    setDataset(data);
  } catch (error) {
    console.error('Error fetching year count:', error);
  }
};
