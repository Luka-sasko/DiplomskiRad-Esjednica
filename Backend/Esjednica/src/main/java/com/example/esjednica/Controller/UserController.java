package com.example.esjednica.Controller;

import com.example.esjednica.Config.JwtUtil;
import com.example.esjednica.Model.KorisnikDTO;
import com.example.esjednica.Model.KorisnikUpdateDTO;
import com.example.esjednica.Model.LoginRequest;
import com.example.esjednica.Model.Korisnik;
import com.example.esjednica.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Set<String> ALLOWED_ROLES = new HashSet<>(Arrays.asList(
            "ROLE_GLEDATELJ",
            "ROLE_KORISNIK",
            "ROLE_PREDLAGATELJ",
            "ROLE_ADMIN"
    ));

    @PostMapping("/register")
    public ResponseEntity<Korisnik> registerUser(@RequestBody Korisnik user) {
        String requestedRoles = user.getRoles();
        if (requestedRoles == null || requestedRoles.isEmpty()) {
            throw new IllegalArgumentException("Roles cannot be empty");
        }

        Set<String> rolesToCheck = new HashSet<>(Arrays.asList(requestedRoles.split(",")));
        if (!ALLOWED_ROLES.containsAll(rolesToCheck)) {
            throw new IllegalArgumentException("Invalid or unauthorized role(s) provided. Allowed roles: " + ALLOWED_ROLES);
        }

        user.setLozinka(passwordEncoder.encode(user.getLozinka()));
        Korisnik savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<Korisnik> optionalUser = userRepository.findByUsername(loginRequest.getUsername());
        if (optionalUser.isPresent()) {
            Korisnik user = optionalUser.get();
            if (passwordEncoder.matches(loginRequest.getLozinka(), user.getLozinka())) {
                List<String> rolesList = Arrays.asList(user.getRoles().split(","));
                String token = jwtUtil.generateToken(user.getUsername(), rolesList, user.getId());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("roles", Arrays.asList(user.getRoles().split(",")));
                userInfo.put("ime", user.getIme());
                userInfo.put("prezime", user.getPrezime());
                userInfo.put("email", user.getEmail());
                response.put("user", userInfo);
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping(value = "/profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PREDLAGATELJ') or hasRole('KORISNIK')")
    public ResponseEntity<?> GetUserProfile(@RequestHeader("Authorization") String authHeader)
    {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }
            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }
            Long userId = JwtUtil.extractUserId(token);
            Optional<Korisnik> korisnik = userRepository.findById(userId);
            KorisnikDTO dto = new KorisnikDTO();
            dto.setIme(korisnik.get().getIme());
            dto.setPrezime(korisnik.get().getPrezime());
            dto.setEmail(korisnik.get().getEmail());
            dto.setUsername(korisnik.get().getUsername());
            dto.setRoles(korisnik.get().getRoles());
            return ResponseEntity.ok(dto);
        }catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }
    @PutMapping("/profile")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PREDLAGATELJ') or hasRole('KORISNIK') or hasRole('GLEDATELJ')")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody KorisnikUpdateDTO updateDTO) {

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }
            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }

            Long userId = JwtUtil.extractUserId(token);
            Optional<Korisnik> korisnikOpt = userRepository.findById(userId);

            if (korisnikOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Korisnik nije pronađen");
            }

            Korisnik korisnik = korisnikOpt.get();
            korisnik.setIme(updateDTO.getIme());
            korisnik.setPrezime(updateDTO.getPrezime());
            korisnik.setEmail(updateDTO.getEmail());
            korisnik.setUsername(updateDTO.getUsername());

            Korisnik updated = userRepository.save(korisnik);

            KorisnikDTO dto = new KorisnikDTO();
            dto.setIme(updated.getIme());
            dto.setPrezime(updated.getPrezime());
            dto.setEmail(updated.getEmail());
            dto.setUsername(updated.getUsername());
            dto.setRoles(updated.getRoles());

            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }





}