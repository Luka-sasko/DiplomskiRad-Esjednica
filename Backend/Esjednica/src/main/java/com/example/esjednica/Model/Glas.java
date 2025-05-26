package com.example.esjednica.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "glasovi", uniqueConstraints = {@UniqueConstraint(columnNames = {"korisnik_id", "tocka_id"})})
public class Glas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "korisnik_id")
    private Integer korisnikId;

    @Column(name = "tocka_id")
    private Long tockaId;

    @Column(nullable = false)
    private String glas;

    // Getteri i setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getKorisnikId() { return korisnikId; }
    public void setKorisnikId(Integer korisnikId) { this.korisnikId = korisnikId; }
    public Long getTockaId() { return tockaId; }
    public void setTockaId(Long tockaId) { this.tockaId = tockaId; }
    public String getGlas() { return glas; }
    public void setGlas(String glas) { this.glas = glas; }
}