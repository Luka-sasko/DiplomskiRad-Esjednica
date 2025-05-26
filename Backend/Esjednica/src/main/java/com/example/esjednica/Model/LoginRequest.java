package com.example.esjednica.Model;

public class LoginRequest {
    private String username;
    private String lozinka;

    // getteri i setteri
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getLozinka() {
        return lozinka;
    }
    public void setLozinka(String password) {
        this.lozinka = password;
    }
}
