import { makeAutoObservable } from "mobx";
import { SjednicaService } from "../api/services/SjednicaService";

class SjednicaStore {
  sjednice = [];
  sjednica = null;
  selected = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getById(id) {
    try {
      const res = await SjednicaService.getById(id);
      this.sjednica = res.data;
    } catch (err) {
      console.error("Greška pri dohvaćanju sjednica", err);
    }
  }

  async fetchAll() {
    try {
      const res = await SjednicaService.getAll();
      this.sjednice = res.data;
    } catch (err) {
      console.error("Greška pri dohvaćanju sjednica", err);
    }
  }

  async add(sjednica) {
    await SjednicaService.create(sjednica);
    await this.fetchAll();
  }

  async delete(id) {
    await SjednicaService.delete(id);
    await this.fetchAll();
  }

  async update(id, sjednica) {
    await SjednicaService.update(id, sjednica);
    await this.fetchAll();
  }

  select(sjednica) {
    this.selected = sjednica;
  }

  clearSelected() {
    this.selected = null;
  }
}

export const sjednicaStore = new SjednicaStore();
