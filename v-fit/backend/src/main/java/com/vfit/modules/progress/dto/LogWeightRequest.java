package com.vfit.modules.progress.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class LogWeightRequest {

    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Float weightKg;

    private LocalDate logDate;

    // Constructors
    public LogWeightRequest() {}

    // Getters
    public Float getWeightKg() { return weightKg; }
    public LocalDate getLogDate() { return logDate; }

    // Setters
    public void setWeightKg(Float weightKg) { this.weightKg = weightKg; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }
}