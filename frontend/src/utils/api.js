// utils/api.js

import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend base URL
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    } else {
      // Optionally handle missing token
      console.warn('No token found, redirecting to login.');
      // router.push('/auth'); // Uncomment if you have access to router
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
