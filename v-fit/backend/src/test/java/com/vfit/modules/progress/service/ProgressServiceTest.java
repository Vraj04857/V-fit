package com.vfit.modules.progress.service;

import com.vfit.modules.progress.dto.LogCaloriesRequest;
import com.vfit.modules.progress.dto.LogWeightRequest;
import com.vfit.modules.progress.entity.CalorieLog;
import com.vfit.modules.progress.entity.WeightLog;
import com.vfit.modules.progress.repository.CalorieLogRepository;
import com.vfit.modules.progress.repository.WeightLogRepository;
import com.vfit.modules.progress.repository.WorkoutLogRepository;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock private WeightLogRepository weightLogRepository;
    @Mock private CalorieLogRepository calorieLogRepository;
    @Mock private WorkoutLogRepository workoutLogRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ProgressService progressService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("vraj@example.com");
    }

    // ============================================================
    // UC-08: Log Weight Tests
    // ============================================================
    @Nested
    @DisplayName("UC-08: Log Weight")
    class LogWeightTests {

        @Test
        @DisplayName("PROG-01: Successfully log weight for today")
        void logWeight_Success() {
            LogWeightRequest request = new LogWeightRequest();
            request.setWeightKg(75.5f);
            request.setLogDate(LocalDate.now());

            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(weightLogRepository.findByUser_UserIdAndLogDate(1L, LocalDate.now()))
                    .thenReturn(Optional.empty());

            WeightLog savedLog = new WeightLog();
            savedLog.setWeightKg(75.5f);
            savedLog.setLogDate(LocalDate.now());
            savedLog.setUser(testUser);
            when(weightLogRepository.save(any(WeightLog.class))).thenReturn(savedLog);

            WeightLog result = progressService.logWeight(1L, request);

            assertNotNull(result);
            assertEquals(75.5f, result.getWeightKg());
            verify(weightLogRepository).save(any(WeightLog.class));
        }

        @Test
        @DisplayName("PROG-02: Update existing weight log for same date")
        void logWeight_UpdateExisting() {
            LogWeightRequest request = new LogWeightRequest();
            request.setWeightKg(76.0f);
            request.setLogDate(LocalDate.now());

            WeightLog existingLog = new WeightLog();
            existingLog.setWeightKg(75.0f);
            existingLog.setLogDate(LocalDate.now());
            existingLog.setUser(testUser);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(weightLogRepository.findByUser_UserIdAndLogDate(1L, LocalDate.now()))
                    .thenReturn(Optional.of(existingLog));
            when(weightLogRepository.save(any(WeightLog.class))).thenAnswer(inv -> inv.getArgument(0));

            WeightLog result = progressService.logWeight(1L, request);

            assertEquals(76.0f, result.getWeightKg());
        }

        @Test
        @DisplayName("PROG-03: Log weight with non-existent user throws exception")
        void logWeight_UserNotFound() {
            LogWeightRequest request = new LogWeightRequest();
            request.setWeightKg(75.0f);

            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> progressService.logWeight(999L, request));

            assertEquals("User not found", ex.getMessage());
        }

        @Test
        @DisplayName("PROG-04: Null logDate defaults to today")
        void logWeight_NullDateDefaultsToToday() {
            LogWeightRequest request = new LogWeightRequest();
            request.setWeightKg(75.0f);
            request.setLogDate(null);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(weightLogRepository.findByUser_UserIdAndLogDate(eq(1L), eq(LocalDate.now())))
                    .thenReturn(Optional.empty());
            when(weightLogRepository.save(any(WeightLog.class))).thenAnswer(inv -> inv.getArgument(0));

            WeightLog result = progressService.logWeight(1L, request);

            assertNotNull(result);
            assertEquals(LocalDate.now(), result.getLogDate());
        }
    }

    // ============================================================
    // UC-08: Log Calories Tests
    // ============================================================
    @Nested
    @DisplayName("UC-08: Log Calories")
    class LogCaloriesTests {

        @Test
        @DisplayName("PROG-05: Successfully log calories")
        void logCalories_Success() {
            LogCaloriesRequest request = new LogCaloriesRequest();
            request.setCaloriesIntake(2200);
            request.setCaloriesBurned(500);
            request.setLogDate(LocalDate.now());

            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(calorieLogRepository.findByUser_UserIdAndLogDate(1L, LocalDate.now()))
                    .thenReturn(Optional.empty());

            CalorieLog savedLog = new CalorieLog();
            savedLog.setCaloriesIntake(2200);
            savedLog.setCaloriesBurned(500);
            savedLog.setLogDate(LocalDate.now());
            savedLog.setUser(testUser);
            when(calorieLogRepository.save(any(CalorieLog.class))).thenReturn(savedLog);

            CalorieLog result = progressService.logCalories(1L, request);

            assertNotNull(result);
            assertEquals(2200, result.getCaloriesIntake());
            assertEquals(500, result.getCaloriesBurned());
        }

        @Test
        @DisplayName("PROG-06: Log calories with non-existent user throws exception")
        void logCalories_UserNotFound() {
            LogCaloriesRequest request = new LogCaloriesRequest();
            request.setCaloriesIntake(2000);

            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> progressService.logCalories(999L, request));

            assertEquals("User not found", ex.getMessage());
        }
    }
}