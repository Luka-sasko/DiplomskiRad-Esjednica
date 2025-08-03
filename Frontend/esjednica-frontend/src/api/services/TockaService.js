import { get, post, put, del } from "../base_api";
const BASE = "/tocke";

export const TockaService = {
  getAll: () => get(BASE),
  getById: (id) => get(`${BASE}/${id}`),
  getBySjednicaId: (sjednicaId) => get(`${BASE}/sjednica/${sjednicaId}`),
  create: (sjednicaId, data) => post(`${BASE}/sjednica/${sjednicaId}`, data),
  update: (id, data) => put(`${BASE}/${id}`, data),
  delete: (id) => del(`${BASE}/${id}`),
};
