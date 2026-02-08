import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response.data", response.data)
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;