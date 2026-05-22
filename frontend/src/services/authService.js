import api from "../api/axios";

export const loginUser = (email, password) =>
  api.post("/login", { email, password });

export const registerUser = (data) =>
  api.post("/register", data);

