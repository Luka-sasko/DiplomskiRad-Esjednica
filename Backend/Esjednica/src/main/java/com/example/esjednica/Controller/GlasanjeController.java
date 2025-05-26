package com.example.esjednica.Controller;

import com.example.esjednica.Model.Glas;
import com.example.esjednica.Service.GlasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/glasanja")
public class GlasanjeController {

    @Autowired
    private GlasService glasService;

    @PostMapping("/tocka/{tockaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'KORISNIK', 'GLEDATELJ', 'PREDLAGATELJ')")
    public ResponseEntity<Glas> glasaj(@PathVariable Long tockaId, @RequestBody Glas glas) {
        glas.setTockaId(tockaId);
        return ResponseEntity.ok(glasService.saveGlas(glas));
    }

    @GetMapping("/tocka/{tockaId}")
    public ResponseEntity<List<Glas>> getGlasoviZaTocku(@PathVariable Long tockaId) {
        return ResponseEntity.ok(glasService.findByTockaId(tockaId));
    }
}