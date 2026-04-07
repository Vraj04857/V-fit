package com.vfit.modules.workout.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_library")
public class ExerciseLibrary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "library_exercise_id")
    private Long libraryExerciseId;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    @Column(length = 50)
    private String category;

    @Column(name = "difficulty_level", length = 20)
    private String difficultyLevel;

    @Column(length = 500)
    private String description;

    @Column(name = "calories_burned_per_min")
    private Integer caloriesBurnedPerMin;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public ExerciseLibrary() {}

    // Getters
    public Long getLibraryExerciseId() { return libraryExerciseId; }
    public String getExerciseName() { return exerciseName; }
    public String getCategory() { return category; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public String getDescription() { return description; }
    public Integer getCaloriesBurnedPerMin() { return caloriesBurnedPerMin; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setLibraryExerciseId(Long id) { this.libraryExerciseId = id; }
    public void setExerciseName(String name) { this.exerciseName = name; }
    public void setCategory(String category) { this.category = category; }
    public void setDifficultyLevel(String level) { this.difficultyLevel = level; }
    public void setDescription(String description) { this.description = description; }
    public void setCaloriesBurnedPerMin(Integer cal) { this.caloriesBurnedPerMin = cal; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}