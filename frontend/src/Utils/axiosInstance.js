import axios from "axios";

const API = axios.create({
  baseURL: "https://sociopedia-front-t7ge.onrender.com/api", // backend URL
});

// Automatically attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
