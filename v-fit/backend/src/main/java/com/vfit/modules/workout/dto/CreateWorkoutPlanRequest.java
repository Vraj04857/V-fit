package com.vfit.modules.workout.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateWorkoutPlanRequest {

    @NotBlank(message = "Plan name is required")
    private String planName;

    private String goalCategory;
    private String scheduleCalendar;
    private List<ExerciseDto> exercises;

    // Constructors
    public CreateWorkoutPlanRequest() {}

    // Getters
    public String getPlanName() { return planName; }
    public String getGoalCategory() { return goalCategory; }
    public String getScheduleCalendar() { return scheduleCalendar; }
    public List<ExerciseDto> getExercises() { return exercises; }

    // Setters
    public void setPlanName(String planName) { this.planName = planName; }
    public void setGoalCategory(String goalCategory) { this.goalCategory = goalCategory; }
    public void setScheduleCalendar(String scheduleCalendar) { this.scheduleCalendar = scheduleCalendar; }
    public void setExercises(List<ExerciseDto> exercises) { this.exercises = exercises; }
}