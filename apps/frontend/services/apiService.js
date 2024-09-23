import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
