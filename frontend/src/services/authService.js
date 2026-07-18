import api from "../api/axios";
import "@/assets/styles/global.css";

export const loginUser = (email, password) =>
  api.post("/login", { email, password });

export const registerUser = (data) =>
  api.post("/register", data);

export const verifyEmail = (token) =>
  api.get(`/verify/${token}`);

export const forgotPasswordUser = (email) =>
  api.post("/forgot-password", { email });

export const resetPasswordUser = (token, password) =>
  api.post("/reset-password", { token, password });

export const resendVerificationEmailUser = (email) =>
  api.post("/resend-verification", { email });

