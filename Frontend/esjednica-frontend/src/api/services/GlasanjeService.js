import { get, post } from '../base_api';
const BASE = '/glasanje';

export const GlasanjeService = {
  glasaj: (data) => post(`${BASE}/glasaj`, data),
  getResults: (tockaId) => get(`${BASE}/rezultati/${tockaId}`)
};
