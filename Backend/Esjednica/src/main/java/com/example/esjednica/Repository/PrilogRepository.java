package com.example.esjednica.Repository;

import com.example.esjednica.Model.Prilog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrilogRepository extends JpaRepository<Prilog, Long> {
    List<Prilog> findByTockaId(Long tockaId);
}
