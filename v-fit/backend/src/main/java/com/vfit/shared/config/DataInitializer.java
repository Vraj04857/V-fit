package com.vfit.shared.config;

import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.diet.repository.FoodLibraryRepository;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import com.vfit.modules.workout.repository.ExerciseLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ExerciseLibraryRepository exerciseLibraryRepository;

    @Autowired
    private FoodLibraryRepository foodLibraryRepository;

    @Override
    public void run(String... args) {
        initializeExercises();
        initializeFoods();
    }

    private void initializeExercises() {
        if (exerciseLibraryRepository.count() == 0) {
            List<ExerciseLibrary> exercises = new ArrayList<>();

            // Cardio exercises
            exercises.add(createExercise("Running", "Cardio", "BEGINNER",
                    "Outdoor or treadmill running", 10));
            exercises.add(createExercise("Cycling", "Cardio", "INTERMEDIATE",
                    "Stationary or outdoor cycling", 8));
            exercises.add(createExercise("Jump Rope", "Cardio", "INTERMEDIATE",
                    "Cardio with jump rope", 12));

            // Strength exercises
            exercises.add(createExercise("Push-ups", "Strength", "BEGINNER",
                    "Classic push-up exercise", 6));
            exercises.add(createExercise("Pull-ups", "Strength", "ADVANCED",
                    "Pull-up bar exercise", 8));
            exercises.add(createExercise("Squats", "Strength", "BEGINNER",
                    "Bodyweight or weighted squats", 7));
            exercises.add(createExercise("Deadlift", "Strength", "ADVANCED",
                    "Barbell deadlift", 9));
            exercises.add(createExercise("Bench Press", "Strength", "INTERMEDIATE",
                    "Barbell bench press", 7));

            // Flexibility
            exercises.add(createExercise("Yoga Flow", "Flexibility", "BEGINNER",
                    "Basic yoga poses", 4));
            exercises.add(createExercise("Stretching", "Flexibility", "BEGINNER",
                    "Full body stretching routine", 3));

            exerciseLibraryRepository.saveAll(exercises);
            System.out.println(" Initialized " + exercises.size() + " exercises");
        }
    }

    private void initializeFoods() {
        if (foodLibraryRepository.count() == 0) {
            List<FoodLibrary> foods = new ArrayList<>();

            // Breakfast foods
            foods.add(createFood("Oatmeal", 150, 5f, 27f, 3f, "1 cup", "Breakfast"));
            foods.add(createFood("Greek Yogurt", 100, 10f, 6f, 0.4f, "1 cup", "Breakfast"));
            foods.add(createFood("Eggs", 70, 6f, 1f, 5f, "1 large", "Breakfast"));
            foods.add(createFood("Whole Wheat Toast", 80, 4f, 15f, 1f, "1 slice", "Breakfast"));
            foods.add(createFood("Banana", 105, 1f, 27f, 0.3f, "1 medium", "Breakfast"));

            // Lunch foods
            foods.add(createFood("Grilled Chicken Breast", 165, 31f, 0f, 3.6f, "100g", "Lunch"));
            foods.add(createFood("Brown Rice", 215, 5f, 45f, 1.8f, "1 cup", "Lunch"));
            foods.add(createFood("Broccoli", 55, 4f, 11f, 0.6f, "1 cup", "Lunch"));
            foods.add(createFood("Sweet Potato", 180, 4f, 41f, 0.3f, "1 medium", "Lunch"));
            foods.add(createFood("Quinoa", 222, 8f, 39f, 4f, "1 cup", "Lunch"));

            // Dinner foods
            foods.add(createFood("Salmon Fillet", 206, 22f, 0f, 12f, "100g", "Dinner"));
            foods.add(createFood("Lean Beef", 250, 26f, 0f, 15f, "100g", "Dinner"));
            foods.add(createFood("Mixed Vegetables", 80, 3f, 17f, 0.5f, "1 cup", "Dinner"));
            foods.add(createFood("Pasta", 200, 7f, 42f, 1f, "1 cup", "Dinner"));
            foods.add(createFood("Tofu", 144, 15f, 3f, 9f, "100g", "Dinner"));

            // Snacks
            foods.add(createFood("Almonds", 164, 6f, 6f, 14f, "1 oz", "Snack"));
            foods.add(createFood("Apple", 95, 0.5f, 25f, 0.3f, "1 medium", "Snack"));
            foods.add(createFood("Protein Bar", 200, 20f, 25f, 8f, "1 bar", "Snack"));
            foods.add(createFood("Cottage Cheese", 163, 28f, 6f, 2f, "1 cup", "Snack"));
            foods.add(createFood("Carrot Sticks", 50, 1f, 12f, 0.3f, "1 cup", "Snack"));

            foodLibraryRepository.saveAll(foods);
            System.out.println(" Initialized " + foods.size() + " foods");
        }
    }

private ExerciseLibrary createExercise(String name, String category,
                                        String difficulty, String description,
                                        int caloriesPerMin) {
        ExerciseLibrary exercise = new ExerciseLibrary();
        exercise.setExerciseName(name);
        exercise.setCategory(category);
        exercise.setDifficultyLevel(difficulty);
        exercise.setDescription(description);
        exercise.setCaloriesBurnedPerMin(caloriesPerMin);
        exercise.setCreatedAt(LocalDateTime.now());
        return exercise;
}

private FoodLibrary createFood(String name, int calories, float protein,
                                float carbs, float fats, String serving,
                                String category) {
        FoodLibrary food = new FoodLibrary();
        food.setFoodName(name);
        food.setCaloriesPerServing(calories);
        food.setProteinGrams(protein);
        food.setCarbsGrams(carbs);
        food.setFatsGrams(fats);
        food.setServingSize(serving);
        food.setCategory(category);
        food.setCreatedAt(LocalDateTime.now());
        return food;
}
}