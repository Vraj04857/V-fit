package com.vfit.modules.progress.entity;

import com.vfit.modules.user.entity.User;
import com.vfit.modules.workout.entity.Exercise;
import com.vfit.modules.workout.entity.WorkoutPlan;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_log")
@EntityListeners(AuditingEntityListener.class)
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workout_log_id")
    private Long workoutLogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = true)
    private WorkoutPlan workoutPlan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exercise_id" , nullable = true)
    private Exercise exercise;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public WorkoutLog() {}

    // Getters
    public Long getWorkoutLogId() { return workoutLogId; }
    public User getUser() { return user; }
    public WorkoutPlan getWorkoutPlan() { return workoutPlan; }
    public Exercise getExercise() { return exercise; }
    public Boolean getCompleted() { return completed; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public LocalDate getLogDate() { return logDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setWorkoutLogId(Long workoutLogId) { this.workoutLogId = workoutLogId; }
    public void setUser(User user) { this.user = user; }
    public void setWorkoutPlan(WorkoutPlan workoutPlan) { this.workoutPlan = workoutPlan; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}