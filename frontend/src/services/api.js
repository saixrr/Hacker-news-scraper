import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002'; // Update with your backend server URL

export const fetchStories = async () => {
  try {
    const response = await axios.get(`http://localhost:5002/getstories`);
    console.log(response)
    return response.data.stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};
