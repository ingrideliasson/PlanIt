import axios from "axios";

// Base URL for backend

const API_BASE_URL = "http://localhost:5140/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Attach token to requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.header.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;