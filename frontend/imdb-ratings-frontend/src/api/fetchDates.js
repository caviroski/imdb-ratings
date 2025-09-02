import { API_BASE_URL } from '../config/api';

export const fetchDates = async (setSortedDates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/file-names`);
    const data = await response.json();
    setSortedDates(data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('.').map(Number);
      const [dayB, monthB, yearB] = b.split('.').map(Number);
      if (yearA !== yearB) return yearA - yearB;
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    }));
  } catch (error) {
    console.error('Failed to fetch file names:', error);
    return [];
  }
};
