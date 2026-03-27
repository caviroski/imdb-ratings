import { API_BASE_URL } from '../config/api';

export const fetchComparison = async (from, to, search, setRows) => {
  try {
    const safeSearch = search || "";

    const response = await fetch(
      `${API_BASE_URL}/compare?from=${from}&to=${to}&search=${encodeURIComponent(safeSearch)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comparison");
    }

    const data = await response.json();
    setRows(data);
  } catch (error) {
    throw error;
  }
};
