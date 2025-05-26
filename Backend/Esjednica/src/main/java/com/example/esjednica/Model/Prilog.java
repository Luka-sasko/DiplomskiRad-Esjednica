package com.example.esjednica.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "prilozi")
public class Prilog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;
    private String ekstenzija;

    @Column(name = "tocka_id")
    private Long tockaId;

    private String putanja;



    // Getteri i setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getEkstenzija() { return ekstenzija; }
    public void setEkstenzija(String ekstenzija) { this.ekstenzija = ekstenzija; }

    public Long getTockaId() { return tockaId; }
    public void setTockaId(Long tockaId) { this.tockaId = tockaId; }

    public String getPutanja() { return putanja; }
    public void setPutanja(String putanja) { this.putanja = putanja; }
}
