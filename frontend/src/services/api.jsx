import axios from "axios";

const api = axios.create({
  baseURL: "/api", // BASE URL for backend
});

// Helper to set/unset the token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token); // persist across refresh
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export default api;

