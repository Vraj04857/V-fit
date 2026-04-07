package com.vfit.modules.diet.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_library")
public class FoodLibrary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "food_name", nullable = false, length = 200)
    private String foodName;

    @Column(name = "calories_per_serving")
    private Integer caloriesPerServing;

    @Column(name = "protein_grams")
    private Float proteinGrams;

    @Column(name = "carbs_grams")
    private Float carbsGrams;

    @Column(name = "fats_grams")
    private Float fatsGrams;

    @Column(name = "serving_size", length = 50)
    private String servingSize;

    @Column(length = 50)
    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public FoodLibrary() {}

    // Getters
    public Long getFoodId() { return foodId; }
    public String getFoodName() { return foodName; }
    public Integer getCaloriesPerServing() { return caloriesPerServing; }
    public Float getProteinGrams() { return proteinGrams; }
    public Float getCarbsGrams() { return carbsGrams; }
    public Float getFatsGrams() { return fatsGrams; }
    public String getServingSize() { return servingSize; }
    public String getCategory() { return category; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public void setCaloriesPerServing(Integer calories) { this.caloriesPerServing = calories; }
    public void setProteinGrams(Float protein) { this.proteinGrams = protein; }
    public void setCarbsGrams(Float carbs) { this.carbsGrams = carbs; }
    public void setFatsGrams(Float fats) { this.fatsGrams = fats; }
    public void setServingSize(String size) { this.servingSize = size; }
    public void setCategory(String category) { this.category = category; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}