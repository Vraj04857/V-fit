package com.vfit.modules.user.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String role = "USER";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // ===== Reset Password Fields =====
    @Column(name = "reset_token", length = 100)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    // Constructors
    public User() {}

    // Getters
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Boolean getIsActive() { return isActive; }
    public String getResetToken() { return resetToken; }
    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }

    // Setters
    public void setUserId(Long userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }
}



// package com.vfit.modules.user.entity;

// import jakarta.persistence.*;
// import org.springframework.data.annotation.CreatedDate;
// import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "users")
// @EntityListeners(AuditingEntityListener.class)
// public class User {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     @Column(name = "user_id")
//     private Long userId;

//     @Column(nullable = false, unique = true, length = 100)
//     private String email;

//     @Column(name = "password_hash", nullable = false)
//     private String passwordHash;

//     @Column(nullable = false, length = 20)
//     private String role = "USER";

//     @CreatedDate
//     @Column(name = "created_at", nullable = false, updatable = false)
//     private LocalDateTime createdAt;

//     @Column(name = "is_active", nullable = false)
//     private Boolean isActive = true;

//     // ✅ Constructors
//     public User() {}

//     // ✅ Getters
//     public Long getUserId() { return userId; }
//     public String getEmail() { return email; }
//     public String getPasswordHash() { return passwordHash; }
//     public String getRole() { return role; }
//     public LocalDateTime getCreatedAt() { return createdAt; }
//     public Boolean getIsActive() { return isActive; }

//     // ✅ Setters
//     public void setUserId(Long userId) { this.userId = userId; }
//     public void setEmail(String email) { this.email = email; }
//     public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
//     public void setRole(String role) { this.role = role; }
//     public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//     public void setIsActive(Boolean isActive) { this.isActive = isActive; }
// }

