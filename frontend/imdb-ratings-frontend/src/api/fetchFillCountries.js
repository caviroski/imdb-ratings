export const fetchFillCountries = async () => {
  console.log("Starting to fill missing countries...");
  try {
    const response = await fetch("http://localhost:8080/api/imdb-ratings/fill-missing-countries", { method: "POST" });

    if (response.ok) {
      const text = await response.text();
      console.log(text || "Countries filled successfully!");
    } else {
      console.log("Error: " + response.status);
    }
  } catch (error) {
    console.error("Error filling countries:", error);
  }
};

export const stopFillCountries = async () => {
  const response = await fetch("http://localhost:8080/api/imdb-ratings/stop-filling-missing-countries", { method: "POST" });
  console.log(await response.text());
};
