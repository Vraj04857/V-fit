package com.vfit.modules.progress.service;

import com.vfit.modules.progress.dto.LogCaloriesRequest;
import com.vfit.modules.progress.dto.LogWeightRequest;
import com.vfit.modules.progress.dto.LogWorkoutRequest;
import com.vfit.modules.progress.dto.ProgressSummaryDto;
import com.vfit.modules.progress.entity.CalorieLog;
import com.vfit.modules.progress.entity.WeightLog;
import com.vfit.modules.progress.entity.WorkoutLog;
import com.vfit.modules.progress.repository.CalorieLogRepository;
import com.vfit.modules.progress.repository.WeightLogRepository;
import com.vfit.modules.progress.repository.WorkoutLogRepository;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.modules.workout.entity.Exercise;
import com.vfit.modules.workout.entity.WorkoutPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private WeightLogRepository weightLogRepository;

    @Autowired
    private CalorieLogRepository calorieLogRepository;

    @Autowired
    private WorkoutLogRepository workoutLogRepository;

    @Autowired
    private UserRepository userRepository;


    // UC-08: Log Weight
    @Transactional
    public WeightLog logWeight(Long userId, LogWeightRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate logDate = request.getLogDate() != null ? 
                request.getLogDate() : LocalDate.now();

        // Check if log already exists for this date
        Optional<WeightLog> existing = weightLogRepository
                .findByUser_UserIdAndLogDate(userId, logDate);

        WeightLog weightLog;
        if (existing.isPresent()) {
            // Update existing
            weightLog = existing.get();
            weightLog.setWeightKg(request.getWeightKg());
        } else {
            // Create new
            weightLog = new WeightLog();
            weightLog.setUser(user);
            weightLog.setWeightKg(request.getWeightKg());
            weightLog.setLogDate(logDate);
        }

        return weightLogRepository.save(weightLog);
    }

    // UC-08: Log Calories
    @Transactional
    public CalorieLog logCalories(Long userId, LogCaloriesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate logDate = request.getLogDate() != null ? 
                request.getLogDate() : LocalDate.now();

        Optional<CalorieLog> existing = calorieLogRepository
                .findByUser_UserIdAndLogDate(userId, logDate);

        CalorieLog calorieLog;
        if (existing.isPresent()) {
            calorieLog = existing.get();
            if (request.getCaloriesIntake() != null) {
                calorieLog.setCaloriesIntake(request.getCaloriesIntake());
            }
            if (request.getCaloriesBurned() != null) {
                calorieLog.setCaloriesBurned(request.getCaloriesBurned());
            }
        } else {
            calorieLog = new CalorieLog();
            calorieLog.setUser(user);
            calorieLog.setCaloriesIntake(request.getCaloriesIntake() != null ? 
                    request.getCaloriesIntake() : 0);
            calorieLog.setCaloriesBurned(request.getCaloriesBurned() != null ? 
                    request.getCaloriesBurned() : 0);
            calorieLog.setLogDate(logDate);
        }

        // Calculate net calories
        int intake = calorieLog.getCaloriesIntake() != null ? 
                calorieLog.getCaloriesIntake() : 0;
        int burned = calorieLog.getCaloriesBurned() != null ? 
                calorieLog.getCaloriesBurned() : 0;
        calorieLog.setNetCalories(intake - burned);

        return calorieLogRepository.save(calorieLog);
    }

//     // UC-08: Log Workout
//     @Transactional
//     public WorkoutLog logWorkout(Long userId, LogWorkoutRequest request) {
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         WorkoutLog workoutLog = new WorkoutLog();
//         workoutLog.setUser(user);

//         if (request.getPlanId() != null) {
//             WorkoutPlan plan = workoutPlanRepository.findById(request.getPlanId())
//                     .orElseThrow(() -> new RuntimeException("Workout plan not found"));
//             workoutLog.setWorkoutPlan(plan);

//             // If exercise ID is provided, find it in the plan
//             if (request.getExerciseId() != null) {
//                 Exercise exercise = plan.getExercises().stream()
//                         .filter(e -> e.getExerciseId().equals(request.getExerciseId()))
//                         .findFirst()
//                         .orElseThrow(() -> new RuntimeException("Exercise not found in plan"));
//                 workoutLog.setExercise(exercise);
//             }
//         }

//         workoutLog.setCompleted(request.getCompleted() != null ? 
//                 request.getCompleted() : false);
//         workoutLog.setDurationMinutes(request.getDurationMinutes());
//         workoutLog.setLogDate(request.getLogDate() != null ? 
//                 request.getLogDate() : LocalDate.now());

//         return workoutLogRepository.save(workoutLog);
//     }


// UC-08: Log Workout (Simplified - no plan/exercise relationship)
    @Transactional
    public WorkoutLog logWorkout(Long userId, LogWorkoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutLog workoutLog = new WorkoutLog();
        workoutLog.setUser(user);
        workoutLog.setCompleted(request.getCompleted() != null ? 
                request.getCompleted() : false);
        workoutLog.setDurationMinutes(request.getDurationMinutes());
        workoutLog.setLogDate(request.getLogDate() != null ? 
                request.getLogDate() : LocalDate.now());

        System.out.println("💾 Logging workout: completed=" + workoutLog.getCompleted() + 
                ", duration=" + workoutLog.getDurationMinutes() + 
                ", date=" + workoutLog.getLogDate());

        return workoutLogRepository.save(workoutLog);
    }


    // UC-09: Get Progress Summary
@Transactional(readOnly = true)
public ProgressSummaryDto getProgressSummary(Long userId, Integer days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days != null ? days : 30);

        ProgressSummaryDto summary = new ProgressSummaryDto();

        // Weight data
        List<WeightLog> weightLogs = weightLogRepository
                .findByUser_UserIdAndLogDateBetweenOrderByLogDate(userId, startDate, endDate);

        if (!weightLogs.isEmpty()) {
        WeightLog latest = weightLogs.get(weightLogs.size() - 1);
        WeightLog oldest = weightLogs.get(0);

        summary.setCurrentWeight(latest.getWeightKg());
        summary.setStartWeight(oldest.getWeightKg());
        summary.setWeightChange(latest.getWeightKg() - oldest.getWeightKg());

            // Weight history for chart
        List<ProgressSummaryDto.WeightDataPoint> weightHistory = weightLogs.stream()
                .map(log -> new ProgressSummaryDto.WeightDataPoint(
                        log.getLogDate().toString(),
                        log.getWeightKg()
                ))
                .collect(Collectors.toList());
        summary.setWeightHistory(weightHistory);
        }

        // Calorie data
        List<CalorieLog> calorieLogs = calorieLogRepository
                .findByUser_UserIdAndLogDateBetweenOrderByLogDate(userId, startDate, endDate);

        if (!calorieLogs.isEmpty()) {
        int totalIntake = calorieLogs.stream()
                .mapToInt(log -> log.getCaloriesIntake() != null ? log.getCaloriesIntake() : 0)
                .sum();
        int totalBurned = calorieLogs.stream()
                .mapToInt(log -> log.getCaloriesBurned() != null ? log.getCaloriesBurned() : 0)
                .sum();

        summary.setAvgCaloriesIntake(totalIntake / calorieLogs.size());
        summary.setAvgCaloriesBurned(totalBurned / calorieLogs.size());

            // Calorie history for chart
        List<ProgressSummaryDto.CalorieDataPoint> calorieHistory = calorieLogs.stream()
                .map(log -> new ProgressSummaryDto.CalorieDataPoint(
                        log.getLogDate().toString(),
                        log.getCaloriesIntake(),
                        log.getCaloriesBurned(),
                        log.getNetCalories()
                ))
                .collect(Collectors.toList());
        summary.setCalorieHistory(calorieHistory);
        }

        // Workout completion data
        Long completedWorkouts = workoutLogRepository
                .countCompletedWorkouts(userId, startDate, endDate);
        summary.setCompletedWorkouts(completedWorkouts);

        return summary;
    }

    // Get all weight logs
    public List<WeightLog> getAllWeightLogs(Long userId) {
        return weightLogRepository.findByUser_UserIdOrderByLogDateDesc(userId);
    }

    // Get all calorie logs
    public List<CalorieLog> getAllCalorieLogs(Long userId) {
        return calorieLogRepository.findByUser_UserIdOrderByLogDateDesc(userId);
    }

    // Get all workout logs
    public List<WorkoutLog> getAllWorkoutLogs(Long userId) {
        return workoutLogRepository.findByUser_UserIdOrderByLogDateDesc(userId);
    }
}