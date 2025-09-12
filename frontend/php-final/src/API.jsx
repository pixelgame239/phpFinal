import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/final/backend',
  withCredentials:true
});

export default api;
