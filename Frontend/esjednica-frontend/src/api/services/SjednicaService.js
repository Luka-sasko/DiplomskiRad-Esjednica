import { get, post, put, del } from "../base_api";
const BASE = "/sjednice";

export const SjednicaService = {
  getAll: () => get(BASE),
  getById: (id) => get(`${BASE}/${id}`),
  create: (data) => post(BASE, data),
  update: (id, data) => put(`${BASE}/${id}`, data),
  delete: (id) => del(`${BASE}/${id}`),
};
