export const fetchFillCountries = async (setMessage) => {
  console.log("Starting to fill missing countries...");
  try {
    const response = await fetch("http://localhost:8080/api/imdb-ratings/fill-missing-countries", { method: "POST" });

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

export const stopFillCountries = async () => {
  const response = await fetch("http://localhost:8080/api/imdb-ratings/stop-filling-missing-countries", { method: "POST" });
  console.log(await response.text());
};
