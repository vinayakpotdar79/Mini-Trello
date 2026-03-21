import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and Redux state then redirect
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
