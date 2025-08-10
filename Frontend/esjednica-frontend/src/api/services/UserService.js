import { get, post, put } from "../base_api";
const BASE = "/users";

export const UserService = {
  login: (data) => post(`${BASE}/login`, data),
  register: (data) => post(`${BASE}/register`, data),
  profile: () => get(`${BASE}/profile`),
  update: (data) => put(`${BASE}/profile`, data),
  updatePassword: (data) => put(`${BASE}/password`, data),
  updateRole: (userId, data) => put(`${BASE}/${userId}/roles`, data),
  searchUsers: (params = {}) => {
    const usp = new URLSearchParams();
    if (params.role) usp.set("role", params.role);
    if (params.q) usp.set("q", params.q);
    if (typeof params.includeAdmins === "boolean")
      usp.set("includeAdmins", String(params.includeAdmins));
    if (typeof params.page === "number") usp.set("page", String(params.page));
    if (typeof params.size === "number") usp.set("size", String(params.size));
    if (Array.isArray(params.sort))
      params.sort.forEach((s) => usp.append("sort", s));

    const qs = usp.toString();
    return get(`${BASE}/search${qs ? `?${qs}` : ""}`);
  },
};
