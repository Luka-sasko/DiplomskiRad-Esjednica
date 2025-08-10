package com.example.esjednica.Controller;

import com.example.esjednica.Config.JwtUtil;
import com.example.esjednica.Model.*;
import com.example.esjednica.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import java.util.Map;
import java.util.stream.Collectors;

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

    @PutMapping("/password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PREDLAGATELJ') or hasRole('KORISNIK') or hasRole('GLEDATELJ')")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody @jakarta.validation.Valid LozinkaUpdateDTO req) {

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }
            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }

            if (!req.getNewPassword().equals(req.getConfirmNewPassword())) {
                return ResponseEntity.badRequest().body("Nova lozinka i potvrda se ne podudaraju");
            }

            Long userId = JwtUtil.extractUserId(token);
            Optional<Korisnik> korisnikOpt = userRepository.findById(userId);
            if (korisnikOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Korisnik nije pronađen");
            }

            Korisnik korisnik = korisnikOpt.get();

            String trenutnaLozinka = korisnik.getLozinka();
            if (!passwordEncoder.matches(req.getCurrentPassword(),trenutnaLozinka)) {
                return ResponseEntity.status(400).body("Trenutna lozinka nije ispravna");
            }
            if (passwordEncoder.matches(req.getNewPassword(), trenutnaLozinka)) {
                return ResponseEntity.status(400).body("Nova lozinka ne smije biti ista kao trenutna");
            }

            korisnik.setLozinka(passwordEncoder.encode(req.getNewPassword()));
            userRepository.save(korisnik);

            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRoles(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long userId,
            @RequestBody @jakarta.validation.Valid RolaUpdateDTO req) {

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }
            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }

            Optional<Korisnik> korisnikOpt = userRepository.findById(userId);
            if (korisnikOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Korisnik nije pronađen");
            }

            Korisnik korisnik = korisnikOpt.get();

            korisnik.setRoles(req.getRoles());

            Korisnik saved = userRepository.save(korisnik);

            KorisnikDTO dto = new KorisnikDTO();
            dto.setIme(saved.getIme());
            dto.setPrezime(saved.getPrezime());
            dto.setEmail(saved.getEmail());
            dto.setUsername(saved.getUsername());
            dto.setRoles(saved.getRoles());

            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchUsers(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "includeAdmins", defaultValue = "false") boolean includeAdmins,
            @org.springframework.data.web.PageableDefault(sort = {"prezime","ime"}, size = 20)
            org.springframework.data.domain.Pageable pageable) {

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
            }
            String token = authHeader.substring(7);
            if (!JwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Token nije valjan");
            }

            String normalizedRole = null;
            if (role != null && !role.isBlank()) {
                normalizedRole = role.trim().toUpperCase(Locale.ROOT);
                if (!normalizedRole.startsWith("ROLE_")) normalizedRole = "ROLE_" + normalizedRole;
                if (!ALLOWED_ROLES.contains(normalizedRole)) {
                    return ResponseEntity.badRequest().body("Nepoznata rola: " + role);
                }
            }

            String roleLike  = (normalizedRole == null) ? null : "%," + normalizedRole + ",%";
            String adminLike = "%,ROLE_ADMIN,%";
            String qLike     = (q == null || q.isBlank()) ? null : "%" + q.toLowerCase(Locale.ROOT) + "%";

            var page = userRepository.searchUsersByRoleAndQuery(
                    includeAdmins, roleLike, adminLike, qLike, pageable
            );

            var dtoPage = page.map(u -> {
                KorisnikDTO dto = new KorisnikDTO();
                dto.setIme(u.getIme());
                dto.setPrezime(u.getPrezime());
                dto.setEmail(u.getEmail());
                dto.setUsername(u.getUsername());
                dto.setRoles(u.getRoles());
                dto.setId(u.getId());
                return dto;
            });

            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }


}