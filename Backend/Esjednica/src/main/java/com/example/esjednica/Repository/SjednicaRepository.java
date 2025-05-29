package com.example.esjednica.Repository;


import com.example.esjednica.Model.Sjednica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;
import java.util.List;

public interface SjednicaRepository extends JpaRepository<Sjednica, Long> {
    List<Sjednica> findByDatumOdrzavanja(LocalDateTime datumOdrzavanja);
    List<Sjednica> findByNaziv(String naziv);
}