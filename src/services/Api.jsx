import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
});
export default api;
