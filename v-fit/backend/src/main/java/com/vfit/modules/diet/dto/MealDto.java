package com.vfit.modules.diet.dto;

public class MealDto {

    private Long mealId;
    private Long foodId;
    private String foodName;
    private String mealType;
    private Integer calories;
    private Float proteinGrams;
    private Float carbsGrams;
    private Float fatsGrams;
    private Integer dayOfWeek;

    // Constructors
    public MealDto() {}

    // Getters
    public Long getMealId() { return mealId; }
    public Long getFoodId() { return foodId; }
    public String getFoodName() { return foodName; }
    public String getMealType() { return mealType; }
    public Integer getCalories() { return calories; }
    public Float getProteinGrams() { return proteinGrams; }
    public Float getCarbsGrams() { return carbsGrams; }
    public Float getFatsGrams() { return fatsGrams; }
    public Integer getDayOfWeek() { return dayOfWeek; }

    // Setters
    public void setMealId(Long mealId) { this.mealId = mealId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public void setMealType(String mealType) { this.mealType = mealType; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public void setProteinGrams(Float proteinGrams) { this.proteinGrams = proteinGrams; }
    public void setCarbsGrams(Float carbsGrams) { this.carbsGrams = carbsGrams; }
    public void setFatsGrams(Float fatsGrams) { this.fatsGrams = fatsGrams; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
}