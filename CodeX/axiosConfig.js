import axios from "axios";
import { logoutUser } from "@/redux/slices/userSlice";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const userAxios = axios.create({
  baseURL: `${API_BASE_URL}api/`,
  withCredentials: true,
});

const adminAxios = axios.create({
  baseURL: `${API_BASE_URL}adminpanel/`,
  withCredentials: true,
});

const tutorAxios = axios.create({
  baseURL: `${API_BASE_URL}tutorpanel/`,
  withCredentials: true,
});

const chatAxios = axios.create({
  baseURL: `${API_BASE_URL}chat/`,
  withCredentials: true,
});

const notificationAxios = axios.create({
  baseURL: `${API_BASE_URL}notifications/`,
  withCredentials: true,
});

// Apply interceptors for token refresh
[userAxios, adminAxios, tutorAxios, chatAxios, notificationAxios].forEach(
  (axiosInstance) => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(`Error status: ${error.response?.status}`);

        if (error.response && error.response.status === 401) {
          console.log("401 error occurred, trying to refresh token...");

          try {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}api/token/refresh/`,
              { refresh: "dummy" },
              { withCredentials: true } // Ensure cookies are sent
            );

            console.log("Token refreshed successfully!");

            const newAccessToken = refreshResponse.data.access;

            // ✅ Update token in headers
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // ✅ Retry the original request
            return axiosInstance(error.config);
          } catch (refreshError) {
            console.error("Refresh token expired, logging out...");
            window.location.href = "/login"; // Redirect user to login page
            return Promise.reject(refreshError);
          }
        }

        if (error.response && error.response.status === 403) {
          console.log("403 Forbidden — logging out user");

          store.dispatch(logoutUser());

          window.location.href = "/login/";

          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }
);

export { userAxios, adminAxios, tutorAxios, chatAxios, notificationAxios };
