export const fetchYearCount = async (setDataset, fromDate = '') => {
  try {
    const response = await fetch(`http://localhost:8080/api/imdb-ratings/year-count?fromDate=${encodeURIComponent(fromDate)}`);
    const data = await response.json();
    setDataset(data);
  } catch (error) {
    console.error('Error fetching year count:', error);
  }
};
