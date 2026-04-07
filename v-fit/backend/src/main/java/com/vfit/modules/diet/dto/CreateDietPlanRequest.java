package com.vfit.modules.diet.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateDietPlanRequest {

    @NotBlank(message = "Plan name is required")
    private String planName;

    private String dietType;
    private String scheduleCalendar;
    private Integer targetCalories;
    private List<MealDto> meals;

    // Constructors
    public CreateDietPlanRequest() {}

    // Getters
    public String getPlanName() { return planName; }
    public String getDietType() { return dietType; }
    public String getScheduleCalendar() { return scheduleCalendar; }
    public Integer getTargetCalories() { return targetCalories; }
    public List<MealDto> getMeals() { return meals; }

    // Setters
    public void setPlanName(String planName) { this.planName = planName; }
    public void setDietType(String dietType) { this.dietType = dietType; }
    public void setScheduleCalendar(String scheduleCalendar) { this.scheduleCalendar = scheduleCalendar; }
    public void setTargetCalories(Integer targetCalories) { this.targetCalories = targetCalories; }
    public void setMeals(List<MealDto> meals) { this.meals = meals; }
}