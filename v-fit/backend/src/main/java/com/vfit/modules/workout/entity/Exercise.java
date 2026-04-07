package com.vfit.modules.workout.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exercise")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "library_exercise_id")
    private ExerciseLibrary libraryExercise;

    private Integer sets;
    private Integer reps;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    // Constructors
    public Exercise() {}

    // Getters
    public Long getExerciseId() { return exerciseId; }
    public WorkoutPlan getWorkoutPlan() { return workoutPlan; }
    public ExerciseLibrary getLibraryExercise() { return libraryExercise; }
    public Integer getSets() { return sets; }
    public Integer getReps() { return reps; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public Integer getDayOfWeek() { return dayOfWeek; }

    // Setters
    public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
    public void setWorkoutPlan(WorkoutPlan workoutPlan) { this.workoutPlan = workoutPlan; }
    public void setLibraryExercise(ExerciseLibrary libraryExercise) { this.libraryExercise = libraryExercise; }
    public void setSets(Integer sets) { this.sets = sets; }
    public void setReps(Integer reps) { this.reps = reps; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
}