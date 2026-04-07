package com.vfit.modules.progress.dto;

import java.time.LocalDate;

public class LogCaloriesRequest {

    private Integer caloriesIntake;
    private Integer caloriesBurned;
    private LocalDate logDate;

    // Constructors
    public LogCaloriesRequest() {}

    // Getters
    public Integer getCaloriesIntake() { return caloriesIntake; }
    public Integer getCaloriesBurned() { return caloriesBurned; }
    public LocalDate getLogDate() { return logDate; }

    // Setters
    public void setCaloriesIntake(Integer caloriesIntake) { this.caloriesIntake = caloriesIntake; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
}