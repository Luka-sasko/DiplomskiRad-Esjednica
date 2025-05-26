import { makeAutoObservable } from 'mobx';
import { TockaService } from '../api/services/TockaService';

class TockaStore {
    tocke = [];
    tocka = [];
    selected = null;


    constructor() {
        makeAutoObservable(this);
    }

   

    async fetchBySjednicaId(sjednicaId) {
        try {
            const res = await TockaService.getBySjednicaId(sjednicaId);
            this.tocke = res.data;
        } catch (err) {
            console.error('Greška pri dohvaćanju točaka za sjednicu:', err);
        }
    }

    async getById(id) {
        try {
            const res = await TockaService.getById(id);
            return this.tocka = res.data;
        } catch (err) {
            console.error('Greška pri dohvaćanju točke:', err);
            throw err;
        }
    }

    async add(sjednicaId, tocka) {
        await TockaService.create(sjednicaId, tocka);
    }

    async update(id, tocka) {
        await TockaService.update(id, tocka);
    }

    async delete(id) {
        await TockaService.delete(id);

    }

    select(tocka) {
        this.selected = tocka;
    }

    clearSelected() {
        this.selected = null;
    }
}

export const tockaStore = new TockaStore();
