package com.vfit.modules.progress.repository;

import com.vfit.modules.progress.entity.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUser_UserIdOrderByLogDateDesc(Long userId);
    List<WeightLog> findByUser_UserIdAndLogDateBetweenOrderByLogDate(
            Long userId, LocalDate startDate, LocalDate endDate);
    Optional<WeightLog> findByUser_UserIdAndLogDate(Long userId, LocalDate logDate);
}