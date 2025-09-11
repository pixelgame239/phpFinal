import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/final/backend', // Set base path to your PHP backend
});

export default api;
