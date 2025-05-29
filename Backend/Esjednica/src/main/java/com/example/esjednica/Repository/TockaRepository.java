package com.example.esjednica.Repository;

import com.example.esjednica.Model.Tocka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;

import java.util.List;
import java.util.Optional;

public interface TockaRepository extends JpaRepository<Tocka, Long> {
    List<Tocka> findBySjednicaId(Long sjednicaId);
    Optional<Tocka> findById(Long id);

}