import { post } from '../base_api';
const BASE = '/users';

export const UserService = {
  login: (data) => post(`${BASE}/login`, data),
  register: (data) => post(`${BASE}/register`, data),
};
