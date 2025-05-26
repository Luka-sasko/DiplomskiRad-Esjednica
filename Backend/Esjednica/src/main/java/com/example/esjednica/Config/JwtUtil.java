package com.example.esjednica.Config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    @Value("${jwt.secret:default-secret-key-12345678901234567890}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // default 1 dan
    private long expirationTimeInMs;

    private static Key signingKey;

    @PostConstruct
    public void init() {
        signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // ✅ Generiranje tokena s ID-em i ulogama
    public String generateToken(String username, List<String> roles, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .claim("id", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeInMs))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Provjera valjanosti tokena
    public static boolean isTokenValid(String token) {
        try {
            extractAllClaims(token); // baca iznimku ako nije valjan
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ Dohvat korisničkog imena
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Dohvat korisničkog ID-a
    public static Long extractUserId(String token) {
        return extractAllClaims(token).get("id", Long.class);
    }

    // ✅ Dohvat korisničkih uloga
    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    // ✅ Sve claimove
    private static Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
