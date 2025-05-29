package com.example.esjednica.Repository;

import com.example.esjednica.Model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Korisnik, Long> {
    Optional<Korisnik> findByUsername(String username); // Potrebno za Spring Security
}