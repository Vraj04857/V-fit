package com.vfit.modules.progress.entity;

import com.vfit.modules.user.entity.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "calorie_log")
@EntityListeners(AuditingEntityListener.class)
public class CalorieLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calorie_log_id")
    private Long calorieLogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "calories_intake")
    private Integer caloriesIntake;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "net_calories")
    private Integer netCalories;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public CalorieLog() {}

    // Getters
    public Long getCalorieLogId() { return calorieLogId; }
    public User getUser() { return user; }
    public Integer getCaloriesIntake() { return caloriesIntake; }
    public Integer getCaloriesBurned() { return caloriesBurned; }
    public Integer getNetCalories() { return netCalories; }
    public LocalDate getLogDate() { return logDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setCalorieLogId(Long calorieLogId) { this.calorieLogId = calorieLogId; }
    public void setUser(User user) { this.user = user; }
    public void setCaloriesIntake(Integer caloriesIntake) { this.caloriesIntake = caloriesIntake; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public void setNetCalories(Integer netCalories) { this.netCalories = netCalories; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}