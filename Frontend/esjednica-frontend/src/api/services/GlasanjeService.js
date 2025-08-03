import { get, post } from "../base_api";

const BASE = "/glasanja";

export const GlasanjeService = {
  getStatus: (tockaId) => get(`${BASE}/tocka/${tockaId}/status`),
  getResults: (tockaId) => get(`${BASE}/tocka/${tockaId}`),
  start: (tockaId, trajanje) =>
    post(`${BASE}/tocka/${tockaId}/start?trajanje=${trajanje}`),
  glasaj: (tockaId, data) => post(`${BASE}/tocka/${tockaId}`, data),
};
