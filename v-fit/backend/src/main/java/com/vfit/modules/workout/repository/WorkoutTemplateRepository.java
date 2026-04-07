package com.vfit.modules.workout.repository;

import com.vfit.modules.workout.entity.WorkoutTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutTemplateRepository extends JpaRepository<WorkoutTemplate, Long> {
    Optional<WorkoutTemplate> findByGoalCategoryAndDifficultyLevel(
            String goalCategory, String difficultyLevel);
}