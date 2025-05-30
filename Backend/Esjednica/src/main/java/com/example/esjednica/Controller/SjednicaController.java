package com.example.esjednica.Controller;

import com.example.esjednica.Config.JwtUtil;
import com.example.esjednica.Model.Glas;
import com.example.esjednica.Model.Sjednica;
import com.example.esjednica.Model.Tocka;
import com.example.esjednica.Service.SjednicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sjednice")
public class SjednicaController {

    @Autowired
    private SjednicaService sjednicaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PREDLAGATELJ')")
    public ResponseEntity<?> kreirajSjednicu(@RequestBody Sjednica sjednica,
                                             @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }

            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }

            Long userId = JwtUtil.extractUserId(token);
            sjednica.setKreiraoId((userId.intValue()));

            Sjednica nova = sjednicaService.saveSjednica(sjednica);
            return ResponseEntity.ok(nova);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'KORISNIK', 'GLEDATELJ', 'PREDLAGATELJ')")
    @GetMapping
    public ResponseEntity<?> getSjednice() {
        return ResponseEntity.ok(sjednicaService.getAllSjednice());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sjednica> getSjednicaById(@PathVariable Long id) {
        return sjednicaService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PREDLAGATELJ')")
    public ResponseEntity<Sjednica> updateSjednica(@PathVariable Long id, @RequestBody Sjednica novaSjednica) {
        return sjednicaService.findById(id)
                .map(s -> {
                    s.setNaziv(novaSjednica.getNaziv());
                    s.setOpis(novaSjednica.getOpis());
                    s.setDatumOdrzavanja(novaSjednica.getDatumOdrzavanja());
                    s.setLokacija(novaSjednica.getLokacija());
                    return ResponseEntity.ok(sjednicaService.saveSjednica(s));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSjednica(@PathVariable Long id) {
        if (sjednicaService.findById(id).isPresent()) {
            sjednicaService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
