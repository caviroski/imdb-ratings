export const fetchYearlyAverage = async (setDataset, cutoffDate = '') => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/imdb-ratings/yearly-average?cutoffDate=${encodeURIComponent(cutoffDate)}`
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
