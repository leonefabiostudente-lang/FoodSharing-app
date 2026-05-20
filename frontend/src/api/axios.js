import axios from "axios";

const api = axios.create({
  baseURL: "https://antispreco-app-2.onrender.com/api",
  withCredentials: true
});

export default api;
