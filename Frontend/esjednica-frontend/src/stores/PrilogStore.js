import { makeAutoObservable, runInAction } from "mobx";
import { PrilogService } from "../api/services/PrilogService";

class PrilogStore {
  prilozi = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchByTockaId(tockaId) {
    this.loading = true;
    try {
      const response = await PrilogService.getAllByTockaId(tockaId);
      runInAction(() => {
        this.prilozi = Array.isArray(response.data) ? response.data : [];
      });
    } catch (error) {
      console.error("Greška pri dohvaćanju priloga:", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async upload(tockaId, formData) {
    try {
      await PrilogService.upload(tockaId, formData);
      await this.fetchByTockaId(tockaId);
    } catch (error) {
      console.error("Greška pri uploadu priloga:", error);
    }
  }

  async download(id) {
    try {
      await PrilogService.download(id);
    } catch (error) {
      console.error("Greška pri preuzimanju priloga:", error);
    }
  }

  async delete(id, tockaId) {
    try {
      await PrilogService.delete(id);
      await this.fetchByTockaId(tockaId);
    } catch (error) {
      console.error("Greška pri brisanju priloga:", error);
    }
  }
}

export const prilogStore = new PrilogStore();
