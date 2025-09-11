import { API_BASE_URL } from '../config/api';

export const fetchComparison = (from, to, search, setRows) => {
  const safeSearch = search || "";
  
  fetch(`${API_BASE_URL}/compare?from=${from}&to=${to}&search=${encodeURIComponent(safeSearch)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch comparison");
      return res.json();
    }).then((data) => {
      setRows(data);
    }).catch((err) => {
      console.error('Error fetching comparison:', err);
      setRows([]);
    });
};
