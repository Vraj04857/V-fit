package com.vfit.modules.workout.service;

import com.vfit.modules.workout.entity.ExerciseLibrary;
import com.vfit.modules.workout.repository.ExerciseLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WgerApiService {

    @Value("${external.wger.base-url}")
    private String wgerBaseUrl;

    @Value("${external.wger.api-key}")
    private String wgerApiKey;

    @Autowired
    private ExerciseLibraryRepository exerciseLibraryRepository;

    private final WebClient webClient;

    public WgerApiService() {
        this.webClient = WebClient.builder().build();
    }

    // Fetch exercises from WGER API
    @SuppressWarnings("unchecked")
    public List<ExerciseLibrary> fetchExercisesFromWger(String category) {
        try {
            String url = wgerBaseUrl + "/exercise/?language=2&limit=20";
            if (category != null && !category.isEmpty()) {
                url += "&category=" + category;
            }

            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .header("Authorization", "Token " + wgerApiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<ExerciseLibrary> exercises = new ArrayList<>();

            if (response != null && response.containsKey("results")) {
                List<Map<String, Object>> results = 
                        (List<Map<String, Object>>) response.get("results");

                for (Map<String, Object> result : results) {
                    ExerciseLibrary exercise = new ExerciseLibrary();
                    exercise.setExerciseName((String) result.get("name"));
                    exercise.setDescription((String) result.get("description"));
                    exercise.setCategory(category != null ? category : "General");
                    exercise.setCreatedAt(LocalDateTime.now());

                    // Default values
                    exercise.setDifficultyLevel("INTERMEDIATE");
                    exercise.setCaloriesBurnedPerMin(5);

                    exercises.add(exercise);
                }
            }

            return exercises;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch exercises from WGER: " 
                    + e.getMessage());
        }
    }

    // Sync exercises to local database
    public void syncExercisesToDatabase(String category) {
        List<ExerciseLibrary> exercises = fetchExercisesFromWger(category);
        exerciseLibraryRepository.saveAll(exercises);
    }
}