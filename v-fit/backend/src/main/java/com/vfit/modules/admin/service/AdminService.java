package com.vfit.modules.admin.service;

import com.vfit.modules.admin.dto.AdminStatsDto;
import com.vfit.modules.admin.dto.AdminUserDto;
import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.diet.repository.FoodLibraryRepository;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import com.vfit.modules.workout.repository.ExerciseLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseLibraryRepository exerciseLibraryRepository;

    @Autowired
    private FoodLibraryRepository foodLibraryRepository;

    // ── Stats ──────────────────────────────────────────────────────────────
    public AdminStatsDto getStats() {
        long total = userRepository.count();
        long active = userRepository.countByIsActive(true);
        long inactive = total - active;
        long exercises = exerciseLibraryRepository.count();
        long foods = foodLibraryRepository.count();
        return new AdminStatsDto(total, active, inactive, exercises, foods);
    }

    // ── Users ──────────────────────────────────────────────────────────────
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new AdminUserDto(
                        u.getUserId(), u.getEmail(), u.getRole(),
                        u.getIsActive(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public AdminUserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return new AdminUserDto(user.getUserId(), user.getEmail(),
                user.getRole(), user.getIsActive(), user.getCreatedAt());
    }

    // ── Exercise Library ───────────────────────────────────────────────────
    public List<ExerciseLibrary> getAllExercises() {
        return exerciseLibraryRepository.findAll();
    }

    public ExerciseLibrary createExercise(ExerciseLibrary exercise) {
        exercise.setCreatedAt(LocalDateTime.now());
        return exerciseLibraryRepository.save(exercise);
    }

    public ExerciseLibrary updateExercise(Long id, ExerciseLibrary updated) {
        ExerciseLibrary existing = exerciseLibraryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        existing.setExerciseName(updated.getExerciseName());
        existing.setCategory(updated.getCategory());
        existing.setDifficultyLevel(updated.getDifficultyLevel());
        existing.setDescription(updated.getDescription());
        existing.setCaloriesBurnedPerMin(updated.getCaloriesBurnedPerMin());
        return exerciseLibraryRepository.save(existing);
    }

    public void deleteExercise(Long id) {
        exerciseLibraryRepository.deleteById(id);
    }

    // ── Food Library ───────────────────────────────────────────────────────
    public List<FoodLibrary> getAllFoods() {
        return foodLibraryRepository.findAll();
    }

    public FoodLibrary createFood(FoodLibrary food) {
        food.setCreatedAt(LocalDateTime.now());
        return foodLibraryRepository.save(food);
    }

    public FoodLibrary updateFood(Long id, FoodLibrary updated) {
        FoodLibrary existing = foodLibraryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found"));
        existing.setFoodName(updated.getFoodName());
        existing.setCaloriesPerServing(updated.getCaloriesPerServing());
        existing.setProteinGrams(updated.getProteinGrams());
        existing.setCarbsGrams(updated.getCarbsGrams());
        existing.setFatsGrams(updated.getFatsGrams());
        existing.setServingSize(updated.getServingSize());
        existing.setCategory(updated.getCategory());
        return foodLibraryRepository.save(existing);
    }

    public void deleteFood(Long id) {
        foodLibraryRepository.deleteById(id);
    }
}