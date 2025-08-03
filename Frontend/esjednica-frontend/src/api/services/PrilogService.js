import { get, post, del, downloadFile } from "../base_api";

const BASE = "/prilozi";

export const PrilogService = {
  getAllByTockaId: (tockaId) => get(`${BASE}/tocka/${tockaId}`),
  getById: (id) => get(`${BASE}/${id}`),
  upload: (tockaId, formData) => post(`${BASE}/upload/${tockaId}`, formData),
  delete: (id) => del(`${BASE}/${id}`),
  download: (id) => downloadFile(`${BASE}/download/${id}`),
};
