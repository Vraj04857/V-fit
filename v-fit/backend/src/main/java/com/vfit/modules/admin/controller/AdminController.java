package com.vfit.modules.admin.controller;

import com.vfit.modules.admin.dto.AdminStatsDto;
import com.vfit.modules.admin.dto.AdminUserDto;
import com.vfit.modules.admin.service.AdminService;
import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .map(u -> "ADMIN".equals(u.getRole()))
                .orElse(false);
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.toggleUserStatus(userId));
    }

    @GetMapping("/exercises")
    public ResponseEntity<?> getAllExercises() {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.getAllExercises());
    }

    @PostMapping("/exercises")
    public ResponseEntity<?> createExercise(@RequestBody ExerciseLibrary exercise) {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.createExercise(exercise));
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody ExerciseLibrary exercise) {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.updateExercise(id, exercise));
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        if (!isAdmin()) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        adminService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/foods")
    public ResponseEntity<?> getAllFoods() {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.getAllFoods());
    }

    @PostMapping("/foods")
    public ResponseEntity<?> createFood(@RequestBody FoodLibrary food) {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.createFood(food));
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<?> updateFood(@PathVariable Long id, @RequestBody FoodLibrary food) {
        if (!isAdmin()) return forbidden();
        return ResponseEntity.ok(adminService.updateFood(id, food));
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        if (!isAdmin()) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        adminService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}