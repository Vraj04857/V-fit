package com.vfit.modules.progress.controller;

import com.vfit.modules.progress.dto.LogCaloriesRequest;
import com.vfit.modules.progress.dto.LogWeightRequest;
import com.vfit.modules.progress.dto.LogWorkoutRequest;
import com.vfit.modules.progress.dto.ProgressSummaryDto;
import com.vfit.modules.progress.entity.CalorieLog;
import com.vfit.modules.progress.entity.WeightLog;
import com.vfit.modules.progress.entity.WorkoutLog;
import com.vfit.modules.progress.service.ProgressService;
import com.vfit.shared.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private SecurityUtils securityUtils;

    // UC-08: Log Weight
    @PostMapping("/weight")
    public ResponseEntity<?> logWeight(@Valid @RequestBody LogWeightRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WeightLog log = progressService.logWeight(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-08: Log Calories
    @PostMapping("/calories")
    public ResponseEntity<?> logCalories(@Valid @RequestBody LogCaloriesRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            CalorieLog log = progressService.logCalories(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-08: Log Workout Completion
    @PostMapping("/workout")
    public ResponseEntity<?> logWorkout(@Valid @RequestBody LogWorkoutRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            WorkoutLog log = progressService.logWorkout(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-09: Get Progress Summary (Analytics Dashboard)
    @GetMapping("/summary")
    public ResponseEntity<?> getProgressSummary(
            @RequestParam(required = false, defaultValue = "30") Integer days) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            ProgressSummaryDto summary = progressService.getProgressSummary(userId, days);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all weight logs
    @GetMapping("/weight")
    public ResponseEntity<?> getAllWeightLogs() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<WeightLog> logs = progressService.getAllWeightLogs(userId);
            return ResponseEntity.ok(logs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all calorie logs
    @GetMapping("/calories")
    public ResponseEntity<?> getAllCalorieLogs() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<CalorieLog> logs = progressService.getAllCalorieLogs(userId);
            return ResponseEntity.ok(logs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all workout logs
    @GetMapping("/workout")
    public ResponseEntity<?> getAllWorkoutLogs() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<WorkoutLog> logs = progressService.getAllWorkoutLogs(userId);
            return ResponseEntity.ok(logs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}