package com.example.esjednica.Service;

import com.example.esjednica.Model.Prilog;
import com.example.esjednica.Repository.PrilogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
@Service
public class PrilogService {

    private static final String UPLOAD_DIR = "uploads";

    @Autowired
    private PrilogRepository prilogRepository;
    public Prilog spremi(MultipartFile file, Long tockaId) throws IOException {
        String original = file.getOriginalFilename();
        String ocisceniNaziv = ocistiNaziv(original);
        String ekstenzija = ocisceniNaziv.substring(ocisceniNaziv.lastIndexOf('.') + 1);
        String noviNaziv = UUID.randomUUID() + "_" + ocisceniNaziv;

        Path path = Paths.get(UPLOAD_DIR, noviNaziv);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        Prilog prilog = new Prilog();
        prilog.setNaziv(ocisceniNaziv);
        prilog.setEkstenzija(ekstenzija);
        prilog.setPutanja(path.toString());
        prilog.setTockaId(tockaId);

        return prilogRepository.save(prilog);
    }
    public Prilog getById(Long id) {
        return prilogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prilog s ID " + id + " ne postoji."));
    }
    public void obrisiPoId(Long id) throws IOException {
        Prilog prilog = prilogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prilog s ID " + id + " ne postoji."));

        Path path = Paths.get(prilog.getPutanja());
        Files.deleteIfExists(path);

        prilogRepository.deleteById(id);
    }
    public List<Prilog> dohvatiZaTocku(Long tockaId) {
        return prilogRepository.findByTockaId(tockaId);
    }


    private String ocistiNaziv(String original) {
        String ekstenzija = "";

        int dotIndex = original.lastIndexOf('.');
        if (dotIndex != -1) {
            ekstenzija = original.substring(dotIndex);
            original = original.substring(0, dotIndex);
        }

        String naziv = original
                .replaceAll("\\s+", "_")               // razmaci u _
                .replaceAll("[^a-zA-Z0-9_-]", "");     // ukloni specijalne znakove

        return naziv + ekstenzija.toLowerCase();  // npr. dokument.pdf
    }



}
