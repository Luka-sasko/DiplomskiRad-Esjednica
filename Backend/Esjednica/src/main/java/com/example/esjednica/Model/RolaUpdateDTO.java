package com.example.esjednica.Model;

import jakarta.validation.constraints.NotEmpty;

public class RolaUpdateDTO {
    @NotEmpty
    private String roles;

    /// Getteri i setteri

    public void setRoles(String roles) {
        this.roles = roles;
    }
    public String getRoles() {
        return roles;
    }
}
