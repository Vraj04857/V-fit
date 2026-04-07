package com.vfit.modules.workout.controller;

import com.vfit.modules.workout.dto.CreateWorkoutPlanRequest;
import com.vfit.modules.workout.dto.WorkoutPlanDto;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import com.vfit.modules.workout.service.AutoWorkoutGeneratorService;
import com.vfit.modules.workout.service.WgerApiService;
import com.vfit.modules.workout.service.WorkoutService;
import com.vfit.shared.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout")
@CrossOrigin(origins = "*")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private AutoWorkoutGeneratorService autoWorkoutGenerator;

    @Autowired
    private WgerApiService wgerApiService;

    @Autowired
    private SecurityUtils securityUtils;

    // UC-04: Get all workout plans
    @GetMapping
    public ResponseEntity<?> getAllWorkoutPlans() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<WorkoutPlanDto> plans = workoutService.getAllWorkoutPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-04: Get single workout plan
    @GetMapping("/{planId}")
    public ResponseEntity<?> getWorkoutPlan(@PathVariable Long planId) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WorkoutPlanDto plan = workoutService.getWorkoutPlan(userId, planId);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-04: Create manual workout plan
    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(
            @Valid @RequestBody CreateWorkoutPlanRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WorkoutPlanDto plan = workoutService.createWorkoutPlan(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-04: Update workout plan
    @PutMapping("/{planId}")
    public ResponseEntity<?> updateWorkoutPlan(
            @PathVariable Long planId,
            @Valid @RequestBody CreateWorkoutPlanRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WorkoutPlanDto plan = workoutService.updateWorkoutPlan(userId, planId, request);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-04: Delete workout plan
    @DeleteMapping("/{planId}")
    public ResponseEntity<?> deleteWorkoutPlan(@PathVariable Long planId) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            workoutService.deleteWorkoutPlan(userId, planId);
            return ResponseEntity.ok("Workout plan deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-07: Auto-generate workout plan
    @PostMapping("/generate")
    public ResponseEntity<?> generateWorkoutPlan() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WorkoutPlanDto plan = autoWorkoutGenerator.generateWorkoutPlan(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get exercise library (for dropdown in frontend)
    @GetMapping("/exercises/library")
    public ResponseEntity<?> getExerciseLibrary() {
        try {
            List<ExerciseLibrary> exercises = workoutService.getAllExercises();
            return ResponseEntity.ok(exercises);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Sync exercises from WGER API
    @PostMapping("/exercises/sync")
    public ResponseEntity<?> syncExercises(
            @RequestParam(required = false) String category) {
        try {
            wgerApiService.syncExercisesToDatabase(category);
            return ResponseEntity.ok("Exercises synced successfully from WGER API");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Failed to sync: " + e.getMessage());
        }
    }
}