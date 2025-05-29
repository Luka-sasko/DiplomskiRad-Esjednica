package com.example.esjednica.Repository;

import com.example.esjednica.Model.Glas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;

import java.util.List;
public interface GlasRepository extends JpaRepository<Glas, Long> {
    List<Glas> findByTockaId(Long tockaId);
    boolean existsByTockaIdAndKorisnikId(Long tockaId, Long korisnikId);

}