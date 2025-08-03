package com.example.esjednica.Model;

public class KorisnikDTO {

    private String ime;

    private String prezime;

    private String email;


    private String roles;

    private String username;

    // Getteri i setteri
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }

    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRoles() { return roles; }
    public void setRoles(String roles) { this.roles = roles; }

}
