package com.example.esjednica.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LozinkaUpdateDTO {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 8, message = "New password must be at least 8 characters.")
    private String newPassword;

    @NotBlank
    private String confirmNewPassword;

    // --- JavaBean getters/setters (lowercase get/set) ---

    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }
    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
