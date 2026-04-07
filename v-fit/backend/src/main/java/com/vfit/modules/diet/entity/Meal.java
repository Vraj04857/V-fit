package com.vfit.modules.diet.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meal")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
    private Long mealId;

    @ManyToOne
    @JoinColumn(name = "diet_plan_id", nullable = false)
    private DietPlan dietPlan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id")
    private FoodLibrary food;

    @Column(name = "meal_type", length = 50)
    private String mealType;

    private Integer calories;

    @Column(name = "protein_grams")
    private Float proteinGrams;

    @Column(name = "carbs_grams")
    private Float carbsGrams;

    @Column(name = "fats_grams")
    private Float fatsGrams;

    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    // Constructors
    public Meal() {}

    // Getters
    public Long getMealId() { return mealId; }
    public DietPlan getDietPlan() { return dietPlan; }
    public FoodLibrary getFood() { return food; }
    public String getMealType() { return mealType; }
    public Integer getCalories() { return calories; }
    public Float getProteinGrams() { return proteinGrams; }
    public Float getCarbsGrams() { return carbsGrams; }
    public Float getFatsGrams() { return fatsGrams; }
    public Integer getDayOfWeek() { return dayOfWeek; }

    // Setters
    public void setMealId(Long mealId) { this.mealId = mealId; }
    public void setDietPlan(DietPlan dietPlan) { this.dietPlan = dietPlan; }
    public void setFood(FoodLibrary food) { this.food = food; }
    public void setMealType(String mealType) { this.mealType = mealType; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public void setProteinGrams(Float proteinGrams) { this.proteinGrams = proteinGrams; }
    public void setCarbsGrams(Float carbsGrams) { this.carbsGrams = carbsGrams; }
    public void setFatsGrams(Float fatsGrams) { this.fatsGrams = fatsGrams; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
}