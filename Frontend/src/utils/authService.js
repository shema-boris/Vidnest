import api from './api';

export const registerUser = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/login', data);
  const { token } = response.data;
  if (token) {
    localStorage.setItem('jwt', token);
  }
  return response.data;
};
