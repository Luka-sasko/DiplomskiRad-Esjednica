import { makeAutoObservable, runInAction } from "mobx";
import { UserService } from "../api/services/UserService";
import { toast } from "react-toastify";

class UserStore {
  user = null;
  token = localStorage.getItem("token") || null;
  manageableUsers = [];
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
  }

  async login(data) {
    try {
      const response = await UserService.login(data);
      this.token = response.data.token;
      this.user = response.data.user;

      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(data) {
    try {
      await UserService.register(data);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  async updatePassword(data) {
    try {
      await UserService.updatePassword(data);
      toast.success("Lozinka je uspješno ažurirana.");
    } catch (error) {
      toast.error("Nešto je pošlo po zlu. Pokušajte ponovo.");
      throw error;
    }
  }

  async updateRole(userId, data) {
    try {
      await UserService.updateRole(userId, data);
      toast.success("Korisnikova uloga je uspješno ažurirana.");
    } catch (error) {
      toast.error("Nešto je pošlo po zlu. Pokušajte ponovo.");
      throw error;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  get isLoggedIn() {
    return !!this.token;
  }

  async loadUsersForAdminFilter({
    role,
    q,
    includeAdmins = false,
    page = 0,
    size = 10,
    sort = ["prezime,asc", "ime,asc"],
  } = {}) {
    this.loadingManageable = true;
    this.manageableError = null;
    try {
      const res = await UserService.searchUsers({
        role,
        q,
        includeAdmins,
        page,
        size,
        sort,
      });
      const pageObj = res?.data ?? res;
      runInAction(() => {
        this.manageableUsers = pageObj?.content ?? [];
        this.totalElements =
          pageObj?.totalElements ?? this.manageableUsers.length;
        this.totalPages = pageObj?.totalPages ?? 1;
        this.page = pageObj?.number ?? page;
        this.size = pageObj?.size ?? size;
      });
      return pageObj;
    } catch (error) {
      console.error("Load users error:", error);
      throw error;
    }
  }
}

export const userStore = new UserStore();
