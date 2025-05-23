import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BURGER_API_URL || 'https://norma.nomoreparties.sbs/api ',
  timeout: 10000
});

export const registerUserApi = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUserApi = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getUserApi = async () => {
  const response = await api.get('/auth/user');
  return response.data;
};

export const updateUserApi = async (data: { name: string; email: string }) => {
  const response = await api.patch('/auth/user', data);
  return response.data;
};

export const getIngredientsApi = async () => {
  const response = await api.get('/ingredients');
  return response.data;
};

export const getOrderApi = async (number: number) => {
  const response = await api.get(`/orders/${number}`);
  return response.data;
};

export const postOrderApi = async (ingredients: string[]) => {
  const response = await api.post('/orders', { ingredients });
  return response.data;
};
