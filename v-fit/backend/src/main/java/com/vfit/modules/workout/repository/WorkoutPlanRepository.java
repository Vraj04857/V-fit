package com.vfit.modules.workout.repository;

import com.vfit.modules.workout.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByUser_UserId(Long userId);
    Optional<WorkoutPlan> findByPlanIdAndUser_UserId(Long planId, Long userId);
}