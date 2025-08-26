export const fetchFillCountries = async (setMessage) => {
  try {
    const response = await fetch("http://localhost:8080/api/imdb-ratings/fill-missing-countries", {
      method: "POST", // or "GET" depending on your controller mapping
    });

    if (response.ok) {
      const text = await response.text();
      setMessage(text || "Countries filled successfully!");
    } else {
      setMessage("Error: " + response.status);
    }
  } catch (error) {
    console.error("Error filling countries:", error);
    setMessage("Failed to connect to backend.");
  }
};
