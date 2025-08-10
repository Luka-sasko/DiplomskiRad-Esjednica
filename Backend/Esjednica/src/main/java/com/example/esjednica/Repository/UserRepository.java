package com.example.esjednica.Repository;

import com.example.esjednica.Model.Korisnik;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.scheduling.annotation.Async;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Korisnik, Long> {
    Optional<Korisnik> findByUsername(String username); // Potrebno za Spring Security
    @Query(
            value = """
            SELECT k FROM Korisnik k
            WHERE (:includeAdmins = true OR CONCAT(',', k.roles, ',') NOT LIKE :adminLike)
              AND (:roleLike IS NULL OR CONCAT(',', k.roles, ',') LIKE :roleLike)
              AND (
                   :qLike IS NULL
                   OR LOWER(k.ime)   LIKE :qLike
                   OR LOWER(k.email) LIKE :qLike
                   OR LOWER(k.prezime) LIKE :qLike
              )
            """,
            countQuery = """
            SELECT COUNT(k) FROM Korisnik k
            WHERE (:includeAdmins = true OR CONCAT(',', k.roles, ',') NOT LIKE :adminLike)
              AND (:roleLike IS NULL OR CONCAT(',', k.roles, ',') LIKE :roleLike)
              AND (
                   :qLike IS NULL
                   OR LOWER(k.ime)   LIKE :qLike
                   OR LOWER(k.email) LIKE :qLike
                   OR LOWER(k.prezime) like :qLike
              )
            """
    )
    Page<Korisnik> searchUsersByRoleAndQuery(
            @Param("includeAdmins") boolean includeAdmins,
            @Param("roleLike") String roleLike,     // npr. "%,ROLE_KORISNIK,%"
            @Param("adminLike") String adminLike,   // "%,ROLE_ADMIN,%"
            @Param("qLike") String qLike,           // npr. "%ana%"
            Pageable pageable
    );
}