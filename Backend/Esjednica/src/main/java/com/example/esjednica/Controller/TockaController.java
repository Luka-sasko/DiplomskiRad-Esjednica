package com.example.esjednica.Controller;

import com.example.esjednica.Model.Tocka;
import com.example.esjednica.Service.TockaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tocke")
public class TockaController {

    @Autowired
    private TockaService tockaService;

    @GetMapping("/sjednica/{sjednicaId}")
    public ResponseEntity<List<Tocka>> getTockeZaSjednicu(@PathVariable Long sjednicaId) {
        return ResponseEntity.ok(tockaService.findBySjednicaId(sjednicaId));
    }

    @PostMapping("/sjednica/{sjednicaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PREDLAGATELJ')")
    public ResponseEntity<Tocka> dodajTocku(@PathVariable Long sjednicaId, @RequestBody Tocka tocka) {
        tocka.setSjednicaId(sjednicaId);
        return ResponseEntity.ok(tockaService.saveTocka(tocka));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tocka> getById(@PathVariable Long id) {
        Tocka tocka = tockaService.findById(id);
        if (tocka == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tocka);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tocka> updateTocka(@PathVariable Long id, @RequestBody Tocka updated) {
        Tocka existing = tockaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setNaziv(updated.getNaziv());
        existing.setOpis(updated.getOpis());
        return ResponseEntity.ok(tockaService.saveTocka(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTocka(@PathVariable Long id) {
        Tocka existing = tockaService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        tockaService.deleteTocka(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start-glasanje")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> startGlasanje(@PathVariable Long id, @RequestParam int trajanje) {
        tockaService.startGlasanje(id, trajanje);
        return ResponseEntity.ok("Glasanje pokrenuto");
    }

    @GetMapping("/{id}/status-glasanje")
    public ResponseEntity<Boolean> isGlasanjeAktivno(@PathVariable Long id) {
        return ResponseEntity.ok(tockaService.isGlasanjeAktivno(id));
    }



}
