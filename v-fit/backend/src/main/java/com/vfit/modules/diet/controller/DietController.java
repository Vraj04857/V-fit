package com.vfit.modules.diet.controller;

import com.vfit.modules.diet.dto.CreateDietPlanRequest;
import com.vfit.modules.diet.dto.DietPlanDto;
import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.diet.service.AutoDietGeneratorService;
import com.vfit.modules.diet.service.DietService;
import com.vfit.shared.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diet")
@CrossOrigin(origins = "*")
public class DietController {

    @Autowired
    private DietService dietService;

    @Autowired
    private AutoDietGeneratorService autoDietGenerator;

    @Autowired
    private SecurityUtils securityUtils;

    // UC-05: Get all diet plans
    @GetMapping
    public ResponseEntity<?> getAllDietPlans() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            List<DietPlanDto> plans = dietService.getAllDietPlans(userId);
            return ResponseEntity.ok(plans);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-05: Get single diet plan
    @GetMapping("/{dietPlanId}")
    public ResponseEntity<?> getDietPlan(@PathVariable Long dietPlanId) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            DietPlanDto plan = dietService.getDietPlan(userId, dietPlanId);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-05: Create manual diet plan
    @PostMapping
    public ResponseEntity<?> createDietPlan(
            @Valid @RequestBody CreateDietPlanRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            DietPlanDto plan = dietService.createDietPlan(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-05: Update diet plan
    @PutMapping("/{dietPlanId}")
    public ResponseEntity<?> updateDietPlan(
            @PathVariable Long dietPlanId,
            @Valid @RequestBody CreateDietPlanRequest request) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            DietPlanDto plan = dietService.updateDietPlan(userId, dietPlanId, request);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-05: Delete diet plan
    @DeleteMapping("/{dietPlanId}")
    public ResponseEntity<?> deleteDietPlan(@PathVariable Long dietPlanId) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            dietService.deleteDietPlan(userId, dietPlanId);
            return ResponseEntity.ok("Diet plan deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-06: Auto-generate diet plan
    @PostMapping("/generate")
    public ResponseEntity<?> generateDietPlan() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            DietPlanDto plan = autoDietGenerator.generateDietPlan(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get food library
    @GetMapping("/foods/library")
    public ResponseEntity<?> getFoodLibrary() {
        try {
            List<FoodLibrary> foods = dietService.getAllFoods();
            return ResponseEntity.ok(foods);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}