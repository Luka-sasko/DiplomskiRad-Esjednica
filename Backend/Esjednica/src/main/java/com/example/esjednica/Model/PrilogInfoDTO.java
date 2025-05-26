package com.example.esjednica.Model;

public class PrilogInfoDTO {
    private Long id;
    private String naziv;
    private String ekstenzija;

    public PrilogInfoDTO(Long id, String naziv, String ekstenzija) {
        this.id = id;
        this.naziv = naziv;
        this.ekstenzija = ekstenzija;
    }

    public Long getId() {
        return id;
    }

    public String getNaziv() {
        return naziv;
    }

    public String getEkstenzija() {
        return ekstenzija;
    }
}
