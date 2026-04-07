package com.vfit.modules.diet.repository;

import com.vfit.modules.diet.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByUser_UserId(Long userId);
    Optional<DietPlan> findByDietPlanIdAndUser_UserId(Long dietPlanId, Long userId);
}