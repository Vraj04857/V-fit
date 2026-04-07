package com.vfit.modules.progress.repository;

import com.vfit.modules.progress.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUser_UserIdOrderByLogDateDesc(Long userId);
    List<WorkoutLog> findByUser_UserIdAndLogDateBetweenOrderByLogDate(
            Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(w) FROM WorkoutLog w WHERE w.user.userId = ?1 AND w.completed = true AND w.logDate BETWEEN ?2 AND ?3")
    Long countCompletedWorkouts(Long userId, LocalDate startDate, LocalDate endDate);
}