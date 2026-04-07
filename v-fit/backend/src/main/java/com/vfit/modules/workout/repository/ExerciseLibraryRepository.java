package com.vfit.modules.workout.repository;

import com.vfit.modules.workout.entity.ExerciseLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseLibraryRepository extends JpaRepository<ExerciseLibrary, Long> {
    List<ExerciseLibrary> findByCategoryAndDifficultyLevel(
            String category, String difficultyLevel);
    List<ExerciseLibrary> findByCategory(String category);
}