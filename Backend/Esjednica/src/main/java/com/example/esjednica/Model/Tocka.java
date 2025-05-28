package com.example.esjednica.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;



@Entity
@Table(name = "tocke")
public class Tocka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sjednica_id")
    private Long sjednicaId;

    @Column(nullable = false)
    private String naziv;

    @Column(columnDefinition = "TEXT")
    private String opis;
    @Column(name = "glasanje_start")
    private LocalDateTime glasanjeStart;

    @Column(name = "glasanje_trajanje")
    private Integer glasanjeTrajanje;

    public LocalDateTime getGlasanjeStart() {
        return glasanjeStart;
    }

    public void setGlasanjeStart(LocalDateTime glasanjeStart) {
        this.glasanjeStart = glasanjeStart;
    }

    public Integer getGlasanjeTrajanje() {
        return glasanjeTrajanje;
    }

    public void setGlasanjeTrajanje(Integer glasanjeTrajanje) {
        this.glasanjeTrajanje = glasanjeTrajanje;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSjednicaId() {
        return sjednicaId;
    }

    public void setSjednicaId(Long sjednicaId) {
        this.sjednicaId = sjednicaId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }


}