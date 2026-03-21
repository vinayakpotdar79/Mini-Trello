import axiosInstance from '../../utils/axiosInstance';

const API_URL = '/api/auth/';

// Register user
const register = async (userData: any) => {
  const response = await axiosInstance.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData: any) => {
  const response = await axiosInstance.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  try {
    axiosInstance.post(API_URL + 'logout');
    console.log('user logged out')
  } catch (error) {
    console.log(error)
  }
};

const authAPI = {
  register,
  login,
  logout,
};

export default authAPI;
