import { makeAutoObservable, runInAction } from 'mobx';
import { GlasanjeService } from '../api/services/GlasanjeService';

class GlasanjeStore {
  aktivno = false;
  rezultati = {};

  constructor() {
    makeAutoObservable(this);
  }

  async getStatus(tockaId) {
    try {
      const response = await GlasanjeService.status(tockaId);
      runInAction(() => {
        this.aktivno = response.data.aktivno;
      });
    } catch (err) {
      console.error('Greška kod dohvaćanja statusa glasanja:', err);
    }
  }

  async loadRezultati(tockaId) {
    try {
      const response = await GlasanjeService.getResults(tockaId);
      runInAction(() => {
        this.rezultati = response.data;
      });

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const jeGlasaoRes = await GlasanjeService.jeGlasao(tockaId, user.id);
        runInAction(() => {
          import('../stores/KorisnikGlasanjeStore').then(({ korisnikGlasanjeStore }) => {
            korisnikGlasanjeStore.jeGlasao = jeGlasaoRes.data;
          });
        });
      }

    } catch (err) {
      console.error('Greška kod dohvaćanja rezultata glasanja:', err);
    }
  }


  async start(tockaId, trajanje) {
    try {
      await GlasanjeService.start(tockaId, trajanje);
    } catch (err) {
      console.error('Greška kod pokretanja glasanja:', err);
    }
  }

  async glasaj(tockaId, data) {

    if (!['ZA', 'PROTIV', 'SUZDRŽAN'].includes(data.glas)) {
      throw new Error("Neispravan glas.");
    }
    try {
      await GlasanjeService.glasaj(tockaId, data);
    } catch (err) {
      console.error('Greška kod glasanja:', err);
    }
  }

}

export const glasanjeStore = new GlasanjeStore();
