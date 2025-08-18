export const fetchComparison = (from, to, search, setRows) => {
  const safeSearch = search || "";
  
  fetch(`http://localhost:8080/api/imdb-ratings/compare?from=${from}&to=${to}&search=${encodeURIComponent(safeSearch)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch comparison");
      return res.json();
    }).then((data) => {
      setRows(data);
    }).catch((err) => {
      console.error('Error fetching comparison:', err);
      setRows([]); // Optional: reset rows on error
    });
};
