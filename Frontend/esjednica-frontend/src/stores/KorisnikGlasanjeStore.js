import { makeAutoObservable, runInAction } from 'mobx';

class KorisnikGlasanjeStore {
  preostaloVrijeme = 0;
  timer = null;

  constructor() {
    makeAutoObservable(this);
  }

  startCountdown(startTime, trajanjeSekundi, onEnd) {
    const start = new Date(startTime).getTime();
    const delay = 5000;
    const end = start + delay + trajanjeSekundi * 1000;

    this.stopCountdown(); 

    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(Math.floor((end - now) / 1000), 0);

      runInAction(() => {
        this.preostaloVrijeme = remaining;
      });

      if (remaining <= 0) {
        this.stopCountdown();
        if (onEnd) onEnd();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const korisnikGlasanjeStore = new KorisnikGlasanjeStore();
