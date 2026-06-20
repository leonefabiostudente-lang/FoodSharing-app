import api from "../api/axios";
import "@/assets/styles/global.css";

export const loginUser = (email, password) =>
  api.post("/login", { email, password });

export const registerUser = (data) =>
  api.post("/register", data);

export const verifyEmail = (token) =>
  api.get(`/verify/${token}`);

