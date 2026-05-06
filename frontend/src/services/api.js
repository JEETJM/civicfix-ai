import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,

  // ✅ Render + Brevo email send time lag-er jonno 60 seconds
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("civicfix_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.code === "ECONNABORTED") {
      message =
        "Server is taking time to send OTP. Please wait and try again after a few seconds.";
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;