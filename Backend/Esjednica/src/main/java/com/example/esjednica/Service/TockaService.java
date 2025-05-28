package com.example.esjednica.Service;

import com.example.esjednica.Model.Tocka;
import com.example.esjednica.Repository.TockaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TockaService {

    @Autowired
    private TockaRepository tockaRepository;

    public Tocka saveTocka(Tocka tocka) {
        return tockaRepository.save(tocka);
    }

    public List<Tocka> findBySjednicaId(Long sjednicaId) {
        return tockaRepository.findBySjednicaId(sjednicaId);
    }

    public Tocka findById(Long id) {
        return tockaRepository.findById(id).orElse(null);
    }

    public void deleteTocka(Long id) {
        tockaRepository.deleteById(id);
    }

    public void startGlasanje(Long tockaId, int trajanjeSekundi) {
        Tocka tocka = tockaRepository.findById(tockaId)
                .orElseThrow(() -> new RuntimeException("Točka ne postoji"));

        tocka.setGlasanjeStart(LocalDateTime.now());
        tocka.setGlasanjeTrajanje(trajanjeSekundi);
        tockaRepository.save(tocka);
    }

    public boolean isGlasanjeAktivno(Long tockaId) {
        Tocka tocka = tockaRepository.findById(tockaId)
                .orElseThrow(() -> new RuntimeException("Točka ne postoji"));

        if (tocka.getGlasanjeStart() == null || tocka.getGlasanjeTrajanje() == null)
            return false;

        LocalDateTime kraj = tocka.getGlasanjeStart().plusSeconds(tocka.getGlasanjeTrajanje());
        return LocalDateTime.now().isBefore(kraj);
    }
}