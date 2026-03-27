import { API_BASE_URL } from '../config/api';

export const fetchTitleTypeCounts = async (setDataset, fromDate) => {
  try {
    const url = fromDate
      ? `${API_BASE_URL}/title-type-count?fromDate=${encodeURIComponent(fromDate)}`
      : `${API_BASE_URL}/title-type-count`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch title type counts');
    }

    const data = await response.json();
    setDataset(data);
  } catch (err) {
    console.error("Error fetching title type counts:", err);
    throw err;
  }
};
