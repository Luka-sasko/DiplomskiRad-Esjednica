import { get, post } from '../base_api';
const BASE = '/glasanja';

export const GlasanjeService = {
  glasaj: (tockaId, data) => post(`${BASE}/tocka/${tockaId}`, data),
  getResults: (tockaId) => get(`${BASE}/tocka/${tockaId}`),
  start: (tockaId, trajanje) => post(`/tocke/${tockaId}/start-glasanje?trajanje=${trajanje}`),
  status: (tockaId) => get(`/tocke/${tockaId}/status-glasanje`)
};
