import { API_BASE_URL } from '../config/api';

export const fillCountries = async () => {
  console.log("Starting to fill missing countries...");
  try {
    const response = await fetch(`${API_BASE_URL}/fill-missing-countries`, { method: "POST" });

    if (response.ok) {
      const text = await response.text();
      console.log(text || "Countries filled successfully!");
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const stopFillCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stop-filling-missing-countries`, { method: "POST" });
    console.log(await response.text());
  } catch (error) {
    throw error;
  }
};
