import { API_BASE_URL } from "../config/api"; 

export async function fetchCountryCounts() {
  try {
    const res = await fetch(`${API_BASE_URL}/country-counts`);
    if (!res.ok) {
      throw new Error("Failed to fetch country counts");
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching country counts:", err);
    throw err;
  }
}
