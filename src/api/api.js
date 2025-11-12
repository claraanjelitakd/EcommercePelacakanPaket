// src/api/api.js
import axios from "axios";

// Ganti baseURL kalau backend kamu dijalankan di server lain
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: logging kalau error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
