package com.vfit.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {

    @NotBlank(message = "Message is required")
    private String message;

    // Constructors
    public ChatRequest() {}

    // Getters
    public String getMessage() { return message; }

    // Setters
    public void setMessage(String message) { this.message = message; }
}