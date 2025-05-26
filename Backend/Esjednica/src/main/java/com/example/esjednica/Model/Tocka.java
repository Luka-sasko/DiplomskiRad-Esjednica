package com.example.esjednica.Model;

import jakarta.persistence.*;
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