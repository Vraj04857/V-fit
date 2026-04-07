package com.vfit.modules.progress.dto;

import java.time.LocalDate;

public class LogWorkoutRequest {

    private Long planId;
    private Long exerciseId;
    private Boolean completed;
    private Integer durationMinutes;
    private LocalDate logDate;

    // Constructors
    public LogWorkoutRequest() {}

    // Getters
    public Long getPlanId() { return planId; }
    public Long getExerciseId() { return exerciseId; }
    public Boolean getCompleted() { return completed; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public LocalDate getLogDate() { return logDate; }

    // Setters
    public void setPlanId(Long planId) { this.planId = planId; }
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
}