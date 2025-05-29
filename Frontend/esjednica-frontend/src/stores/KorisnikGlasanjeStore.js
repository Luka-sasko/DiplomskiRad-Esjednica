import { makeAutoObservable, runInAction } from 'mobx';
import { GlasanjeService } from '../api/services/GlasanjeService';

class KorisnikGlasanjeStore {
  preostaloVrijeme = 0;
  jeGlasao = false;
  interval = null;

  constructor() {
    makeAutoObservable(this);
  }

  async provjeriJeLiGlasao(tockaId) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      const res = await GlasanjeService.jeGlasao(tockaId, user.id);
      runInAction(() => {
        this.jeGlasao = res.data;
      });
    } catch (err) {
      console.error('Greška kod provjere je li korisnik glasao:', err);
    }
  }

  startCountdown(startTime, trajanje, onKraj) {
    const start = new Date(startTime).getTime();
    const end = start + trajanje * 1000;

    this.stopCountdown();

    this.interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      runInAction(() => {
        this.preostaloVrijeme = remaining;
      });

      if (remaining <= 0) {
        this.stopCountdown();
        onKraj && onKraj();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const korisnikGlasanjeStore = new KorisnikGlasanjeStore();
