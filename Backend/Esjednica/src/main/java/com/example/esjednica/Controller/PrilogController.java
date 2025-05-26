package com.example.esjednica.Controller;

import com.example.esjednica.Model.Prilog;
import com.example.esjednica.Model.PrilogInfoDTO;
import com.example.esjednica.Repository.PrilogRepository;
import com.example.esjednica.Service.PrilogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.UrlResource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;



@RestController
@RequestMapping("/api/prilozi")
public class PrilogController {

    @Autowired
    private PrilogService prilogService;
    @Autowired
    private PrilogRepository prilogRepository;

    @PostMapping("/upload/{tockaId}")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,
                                    @PathVariable("tockaId") Long tockaId) {
        try {
            Prilog prilog = prilogService.spremi(file, tockaId);
            return ResponseEntity.ok("Uspješno spremljeno! Putanja: " + prilog.getPutanja());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Greška: " + e.getMessage());
        }
    }




    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        Prilog prilog = prilogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prilog ne postoji"));

        Path path = Paths.get(prilog.getPutanja());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Datoteka nije pronađena ili nije čitljiva.");
        }

        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        String fileName = prilog.getNaziv(); // npr. Luka_CV.pdf
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"; filename*=UTF-8''" + encodedFileName)
                .body(resource);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> obrisi(@PathVariable Long id) {
        try {
            prilogService.obrisiPoId(id);
            return ResponseEntity.ok("Prilog s ID " + id + " je uspješno obrisan.");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Greška pri brisanju fajla: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/tocka/{tockaId}")
    public ResponseEntity<List<PrilogInfoDTO>> getByTocka(@PathVariable Long tockaId) {
        List<Prilog> prilozi = prilogService.dohvatiZaTocku(tockaId);

        List<PrilogInfoDTO> dtoLista = prilozi.stream()
                .map(p -> new PrilogInfoDTO(p.getId(), p.getNaziv(), p.getEkstenzija()))
                .toList();

        return ResponseEntity.ok(dtoLista);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PrilogInfoDTO> getById(@PathVariable Long id) {
        Prilog prilog = prilogService.getById(id);
        PrilogInfoDTO dto = new PrilogInfoDTO(
                prilog.getId(),
                prilog.getNaziv(),
                prilog.getEkstenzija()
        );
        return ResponseEntity.ok(dto);
    }








}
