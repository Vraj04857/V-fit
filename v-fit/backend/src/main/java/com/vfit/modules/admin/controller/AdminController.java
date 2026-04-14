package com.vfit.modules.admin.controller;

import com.vfit.modules.admin.dto.AdminStatsDto;
import com.vfit.modules.admin.dto.AdminUserDto;
import com.vfit.modules.admin.service.AdminService;
import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ── Stats ──────────────────────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Users ──────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<AdminUserDto> toggleUserStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleUserStatus(userId));
    }

    // ── Exercise Library ───────────────────────────────────────────────────
    @GetMapping("/exercises")
    public ResponseEntity<List<ExerciseLibrary>> getAllExercises() {
        return ResponseEntity.ok(adminService.getAllExercises());
    }

    @PostMapping("/exercises")
    public ResponseEntity<ExerciseLibrary> createExercise(@RequestBody ExerciseLibrary exercise) {
        return ResponseEntity.ok(adminService.createExercise(exercise));
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<ExerciseLibrary> updateExercise(
            @PathVariable Long id, @RequestBody ExerciseLibrary exercise) {
        return ResponseEntity.ok(adminService.updateExercise(id, exercise));
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        adminService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    // ── Food Library ───────────────────────────────────────────────────────
    @GetMapping("/foods")
    public ResponseEntity<List<FoodLibrary>> getAllFoods() {
        return ResponseEntity.ok(adminService.getAllFoods());
    }

    @PostMapping("/foods")
    public ResponseEntity<FoodLibrary> createFood(@RequestBody FoodLibrary food) {
        return ResponseEntity.ok(adminService.createFood(food));
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodLibrary> updateFood(
            @PathVariable Long id, @RequestBody FoodLibrary food) {
        return ResponseEntity.ok(adminService.updateFood(id, food));
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        adminService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}