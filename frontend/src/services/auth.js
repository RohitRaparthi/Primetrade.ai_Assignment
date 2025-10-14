// frontend/src/services/auth.js
import API from './api';

export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const signup = async (name, email, password) => {
  const res = await API.post('/auth/signup', { name, email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get('/auth/profile');
  return res.data;
};
