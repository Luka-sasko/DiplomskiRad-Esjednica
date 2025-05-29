package com.example.esjednica.Controller;

import com.example.esjednica.Config.CustomPrincipal;
import com.example.esjednica.Model.Glas;
import com.example.esjednica.Model.GlasDTO;
import com.example.esjednica.Model.Tocka;
import com.example.esjednica.Service.GlasService;
import com.example.esjednica.Service.TockaService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.example.esjednica.Config.GlasanjeEvent;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.HashMap;


@RestController
@RequestMapping("/api/glasanja")
public class GlasanjeController {
    @Autowired
    private GlasService glasService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private TockaService tockaService;


    @PostMapping("/tocka/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> startGlasanje(@PathVariable Long id, @RequestParam int trajanje) {
        tockaService.startGlasanje(id, trajanje);

        GlasanjeEvent eventStart = new GlasanjeEvent(id, true);
        messagingTemplate.convertAndSend("/topic/glasanje", eventStart);

        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.schedule(() -> {
            GlasanjeEvent eventKraj = new GlasanjeEvent(id, false);
            messagingTemplate.convertAndSend("/topic/glasanje", eventKraj);
            scheduler.shutdown();
        }, trajanje, TimeUnit.SECONDS);

        return ResponseEntity.ok("Glasanje pokrenuto");
    }

    @GetMapping("/tocka/{id}/status")
    public ResponseEntity<?> getStatusGlasanja(@PathVariable Long id) {
        Tocka tocka = tockaService.findById(id);
        if (tocka == null) {
            return ResponseEntity.status(404).body("Točka nije pronađena");
        }
        boolean aktivno = tockaService.isGlasanjeAktivno(id);

        Map<String, Object> response = new HashMap<>();
        response.put("aktivno", aktivno);
        response.put("start", tocka.getGlasanjeStart());
        response.put("trajanje", tocka.getGlasanjeTrajanje());

        return ResponseEntity.ok(response);
    }


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