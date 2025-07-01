// API base URL configuration
export const API_URL =
  import.meta.env.MODE === "production"
    ? "https://genuinevitals.com/api"
    : "http://localhost:4000/api";
