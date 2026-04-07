package com.vfit.modules.progress.entity;

import com.vfit.modules.user.entity.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weight_log")
@EntityListeners(AuditingEntityListener.class)
public class WeightLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weight_log_id")
    private Long weightLogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "weight_kg", nullable = false)
    private Float weightKg;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public WeightLog() {}

    // Getters
    public Long getWeightLogId() { return weightLogId; }
    public User getUser() { return user; }
    public Float getWeightKg() { return weightKg; }
    public LocalDate getLogDate() { return logDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setWeightLogId(Long weightLogId) { this.weightLogId = weightLogId; }
    public void setUser(User user) { this.user = user; }
    public void setWeightKg(Float weightKg) { this.weightKg = weightKg; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}