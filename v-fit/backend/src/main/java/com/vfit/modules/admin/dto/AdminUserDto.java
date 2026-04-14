package com.vfit.modules.admin.dto;

import java.time.LocalDateTime;

public class AdminUserDto {

    private Long userId;
    private String email;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public AdminUserDto() {}

    public AdminUserDto(Long userId, String email, String role,
                        Boolean isActive, LocalDateTime createdAt) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}