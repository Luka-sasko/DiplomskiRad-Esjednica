package com.example.esjednica.Repository;

import com.example.esjednica.Model.Tocka;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TockaRepository extends JpaRepository<Tocka, Long> {
    List<Tocka> findBySjednicaId(Long sjednicaId); // Pronalazi sve točke za određenu sjednicu
}