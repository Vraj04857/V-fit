package com.vfit.modules.diet.repository;

import com.vfit.modules.diet.entity.DietTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DietTemplateRepository extends JpaRepository<DietTemplate, Long> {
    Optional<DietTemplate> findByDietType(String dietType);
}
