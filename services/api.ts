import axios from "axios";

const api = axios.create({
  baseURL: "https://safezone-api-r535.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
