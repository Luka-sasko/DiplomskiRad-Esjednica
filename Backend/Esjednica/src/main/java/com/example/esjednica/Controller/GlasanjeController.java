package com.example.esjednica.Controller;

import com.example.esjednica.Config.CustomPrincipal;
import com.example.esjednica.Model.Glas;
import com.example.esjednica.Model.GlasDTO;
import com.example.esjednica.Service.GlasService;
import com.example.esjednica.Service.TockaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
    @Autowired
    private TockaService tockaService;

    @PostMapping("/tocka/{tockaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'KORISNIK', 'GLEDATELJ', 'PREDLAGATELJ')")
    public ResponseEntity<String> glasaj(@PathVariable Long tockaId, @RequestBody GlasDTO glasDTO, Authentication authentication) {

        CustomPrincipal user = (CustomPrincipal) authentication.getPrincipal();

        if(!tockaService.isGlasanjeAktivno(tockaId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Glasanje nije aktivno za ovu točku.");
        }
        if (glasService.hasUserAlreadyVoted(tockaId, user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Korisnik je već glasao.");
        }



        Glas glas = new Glas();
        glas.setGlas((glasDTO.getGlas()));
        glas.setKorisnikId(user.getId());
        glas.setTockaId(tockaId);
        return ResponseEntity.ok(glasService.saveGlas(glas).toString());
    }



    @GetMapping("/tocka/{tockaId}")
    public ResponseEntity<List<Glas>> getGlasoviZaTocku(@PathVariable Long tockaId) {
        return ResponseEntity.ok(glasService.findByTockaId(tockaId));
    }
}