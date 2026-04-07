package com.vfit.modules.diet.repository;

import com.vfit.modules.diet.entity.FoodLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodLibraryRepository extends JpaRepository<FoodLibrary, Long> {
    List<FoodLibrary> findByCategory(String category);
}