import { makeAutoObservable, runInAction } from 'mobx';
import { glasanjeStore } from './GlasanjeStore';

class KorisnikGlasanjeStore {
    korisnikId = null;
    jeGlasao = false;
    tipGlasa = null;
    preostaloVrijeme = null;
    interval = null;

    constructor() {
        makeAutoObservable(this);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.korisnikId = user.id;
        }
    }

    async provjeriJeLiGlasao(tockaId) {
        try {
            const glasovi = await glasanjeStore.getGlasovi(tockaId);
            const mojGlas = glasovi.find(g => g.korisnikId === this.korisnikId);
            runInAction(() => {
                this.jeGlasao = !!mojGlas;
                this.tipGlasa = mojGlas?.glas || null;
                if (this.jeGlasao) {
                    localStorage.setItem(`glasao_${tockaId}`, 'true');
                }

            });
        } catch (err) {
            console.error("Greška kod provjere glasa korisnika:", err);
        }
    }

    reset() {
        this.jeGlasao = false;
        this.tipGlasa = null;
    }

    startCountdown(glasanjeStart, glasanjeTrajanje, onFinish) {
        const start = new Date(glasanjeStart);
        const end = new Date(start.getTime() + glasanjeTrajanje * 1000);

        this.stopCountdown();

        this.interval = setInterval(() => {
            const now = new Date();
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            runInAction(() => {
                this.preostaloVrijeme = diff;
            });
            if (diff <= 0) {
                this.stopCountdown();
                onFinish?.();
            }
        }, 1000);
    }

    stopCountdown() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        runInAction(() => {
            this.preostaloVrijeme = null;
        });
    }
}

export const korisnikGlasanjeStore = new KorisnikGlasanjeStore();
