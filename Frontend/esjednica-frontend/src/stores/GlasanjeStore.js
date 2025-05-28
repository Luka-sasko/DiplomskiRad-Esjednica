import { makeAutoObservable } from 'mobx';
import { GlasanjeService } from '../api/services/GlasanjeService';

class GlasanjeStore {
  aktivno = false;
  rezultati = {};

  constructor() {
    makeAutoObservable(this);
  }

  async checkStatus(tockaId) {
    try {
      const res = await GlasanjeService.status(tockaId);
      this.aktivno = res.data;
    } catch (e) {
      console.error("Greška kod provjere statusa:", e);
    }
  }

  async start(tockaId, trajanje) {
    try {
      await GlasanjeService.start(tockaId, trajanje);
      this.aktivno = true;
    } catch (e) {
      console.error("Greška kod pokretanja:", e);
    }
  }

  async glasaj(tockaId, glas) {
    try {
      await GlasanjeService.glasaj(tockaId, { glas });
    } catch (e) {
      console.error("Greška kod glasanja:", e);
    }
  }

  async loadRezultati(tockaId) {
    try {
      const res = await GlasanjeService.getResults(tockaId);
      const grupirano = { ZA: 0, PROTIV: 0, SUZDRŽAN: 0 };
      res.data.forEach(g => {
        if (grupirano[g.glas]) grupirano[g.glas]++;
        else grupirano[g.glas] = 1;
      });
      this.rezultati = grupirano;
    } catch (e) {
      console.error("Greška kod rezultata:", e);
    }
  }

  async getGlasovi(tockaId) {
  try {
    const res = await GlasanjeService.getResults(tockaId);
    const result = res.data
    return result;
  } catch (e) {
    console.error("Greška kod getGlasovi:", e);
    return [];
  }
}




setGlasanjaStatus(status)
{
  this.aktivno=status;
}

}

export const glasanjeStore = new GlasanjeStore();
