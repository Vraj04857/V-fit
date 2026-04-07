package com.vfit.modules.user.dto;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String name;
    private String message;

    // ✅ Constructors
    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String name, String message) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.message = message;
    }

    // ✅ Getters
    public String getToken() { return token; }
    public String getType() { return type; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getMessage() { return message; }

    // ✅ Setters
    public void setToken(String token) { this.token = token; }
    public void setType(String type) { this.type = type; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setMessage(String message) { this.message = message; }
}