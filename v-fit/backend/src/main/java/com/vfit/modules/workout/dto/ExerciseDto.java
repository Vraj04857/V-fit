package com.vfit.modules.workout.dto;

public class ExerciseDto {

    private Long exerciseId;
    private Long libraryExerciseId;
    private String exerciseName;
    private String category;
    private Integer sets;
    private Integer reps;
    private Integer durationMinutes;
    private Integer dayOfWeek;
    private String muscleGroup;

    // Constructors
    public ExerciseDto() {}

    // Getters
    public Long getExerciseId() { return exerciseId; }
    public Long getLibraryExerciseId() { return libraryExerciseId; }
    public String getExerciseName() { return exerciseName; }
    public String getCategory() { return category; }
    public Integer getSets() { return sets; }
    public Integer getReps() { return reps; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Integer getDayOfWeek() { return dayOfWeek; }
    public String getMuscleGroup() { return muscleGroup; }

    // Setters
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    public void setLibraryExerciseId(Long id) { this.libraryExerciseId = id; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public void setCategory(String category) { this.category = category; }
    public void setSets(Integer sets) { this.sets = sets; }
    public void setReps(Integer reps) { this.reps = reps; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }
}