import axios from 'axios';

const api = axios.create({
  baseURL: 'http://online-restaurant.great-site.net/final/backend',
  withCredentials:true
});

export default api;
