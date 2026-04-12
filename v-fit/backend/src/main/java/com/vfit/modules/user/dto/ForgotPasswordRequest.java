package com.vfit.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // Constructors
    public ForgotPasswordRequest() {}

    // Getters
    public String getEmail() { return email; }

    // Setters
    public void setEmail(String email) { this.email = email; }
}