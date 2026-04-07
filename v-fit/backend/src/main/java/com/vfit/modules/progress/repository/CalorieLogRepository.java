package com.vfit.modules.progress.repository;

import com.vfit.modules.progress.entity.CalorieLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalorieLogRepository extends JpaRepository<CalorieLog, Long> {
    List<CalorieLog> findByUser_UserIdOrderByLogDateDesc(Long userId);
    List<CalorieLog> findByUser_UserIdAndLogDateBetweenOrderByLogDate(
            Long userId, LocalDate startDate, LocalDate endDate);
    Optional<CalorieLog> findByUser_UserIdAndLogDate(Long userId, LocalDate logDate);
}