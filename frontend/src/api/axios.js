import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ GIUSTO
  // withCredentials: true ❌ RIMOSSO
});

export default api;