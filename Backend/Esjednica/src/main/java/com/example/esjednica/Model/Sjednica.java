package com.example.esjednica.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "sjednice")
public class Sjednica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    @Column
    private String opis;

    @Column(name = "datum_odrzavanja", nullable = false)
    private LocalDateTime datumOdrzavanja;

    @Column(name = "lokacija")
    private String lokacija;

    @Column(name = "kreirao_id")
    private Integer kreiraoId;

    @Column(nullable = false)
    private LocalDate datum;

    @PrePersist
    public void postaviDatumKreiranja() {
        this.datum = LocalDate.now();
    }

}