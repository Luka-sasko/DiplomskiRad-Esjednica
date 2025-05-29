import { makeAutoObservable } from 'mobx';
import { GlasanjeService } from '../api/services/GlasanjeService';

class GlasanjeStore {
  aktivno = false;
  trajanje = 0;
  start = null;
  rezultati = [];
  jeGlasao = false;

  constructor() {
    makeAutoObservable(this);
  }

  async ucitajStatus(tockaId) {
    const res = await GlasanjeService.getStatus(tockaId);
    this.aktivno = res.data.aktivno;
    this.trajanje = res.data.trajanje;
    this.start = res.data.start;
  }

  async ucitajGlasove(tockaId) {
    const res = await GlasanjeService.getResults(tockaId);
    this.rezultati = res.data;
    const user = JSON.parse(localStorage.getItem('user'));
    this.jeGlasao = res.data.some(g => g.korisnikId === user.id);
  }

  async glasaj(tockaId, data) {
    await GlasanjeService.glasaj(tockaId, data);
    this.jeGlasao = true;
    await this.ucitajGlasove(tockaId);
  }


  async startGlasanje(tockaId, trajanje) {
    await GlasanjeService.start(tockaId, trajanje);
  }
}

export const glasanjeStore = new GlasanjeStore();
