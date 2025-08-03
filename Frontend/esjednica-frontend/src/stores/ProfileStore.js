import { makeAutoObservable } from "mobx";
import { UserService } from "../api/services/UserService";

class ProfileStore {
  profile = null;
  constructor() {
    makeAutoObservable(this);
  }

  async getProfileData() {
    try {
      const response = await UserService.profile();
      this.profile = response.data;
    } catch (error) {
      console.error("Profile error:", error);
      throw error;
    }
  }

  async updateProfile(data) {
    try {
      await UserService.update(data);
      await this.getProfileData();
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  isAdmin() {
    if (!this.profile?.roles) return false;
    if (Array.isArray(this.profile.roles)) {
      return this.profile.roles.includes("ROLE_ADMIN");
    }
    return this.profile.roles === "ROLE_ADMIN";
  }
}
export const profileStore = new ProfileStore();
