import axios from 'axios';

const api = axios.create({
  baseURL:  'https://tis5-backend.herokuapp.com'
});

export default api;