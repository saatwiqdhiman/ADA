import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies to manage tokens

const API_URL = 'http://localhost:5000'; // Adjust this if your backend is hosted elsewhere

// Register user
export const register = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      firstName,  // Send firstName separately
      lastName,   // Send lastName separately
      email,      // Send email
      password    // Send password
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error);
    if (error.response && error.response.data.msg === 'User already exists') {
      throw new Error('User already exists');
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    // Store the JWT token in a cookie
    const token = response.data.token;
    Cookies.set('token', token, { expires: 1 }); // Token expires in 1 day

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  Cookies.remove('token'); // Remove token from cookies
};
