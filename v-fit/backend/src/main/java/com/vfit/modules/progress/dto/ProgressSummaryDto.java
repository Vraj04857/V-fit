package com.vfit.modules.progress.dto;

import java.util.List;

public class ProgressSummaryDto {

    private Float currentWeight;
    private Float startWeight;
    private Float weightChange;
    private Integer avgCaloriesIntake;
    private Integer avgCaloriesBurned;
    private Long completedWorkouts;
    private List<WeightDataPoint> weightHistory;
    private List<CalorieDataPoint> calorieHistory;

    // Constructors
    public ProgressSummaryDto() {}

    // Getters
    public Float getCurrentWeight() { return currentWeight; }
    public Float getStartWeight() { return startWeight; }
    public Float getWeightChange() { return weightChange; }
    public Integer getAvgCaloriesIntake() { return avgCaloriesIntake; }
    public Integer getAvgCaloriesBurned() { return avgCaloriesBurned; }
    public Long getCompletedWorkouts() { return completedWorkouts; }
    public List<WeightDataPoint> getWeightHistory() { return weightHistory; }
    public List<CalorieDataPoint> getCalorieHistory() { return calorieHistory; }

    // Setters
    public void setCurrentWeight(Float currentWeight) { this.currentWeight = currentWeight; }
    public void setStartWeight(Float startWeight) { this.startWeight = startWeight; }
    public void setWeightChange(Float weightChange) { this.weightChange = weightChange; }
    public void setAvgCaloriesIntake(Integer avgCaloriesIntake) { this.avgCaloriesIntake = avgCaloriesIntake; }
    public void setAvgCaloriesBurned(Integer avgCaloriesBurned) { this.avgCaloriesBurned = avgCaloriesBurned; }
    public void setCompletedWorkouts(Long completedWorkouts) { this.completedWorkouts = completedWorkouts; }
    public void setWeightHistory(List<WeightDataPoint> weightHistory) { this.weightHistory = weightHistory; }
    public void setCalorieHistory(List<CalorieDataPoint> calorieHistory) { this.calorieHistory = calorieHistory; }

    // Nested classes for chart data
    public static class WeightDataPoint {
        private String date;
        private Float weight;

        public WeightDataPoint(String date, Float weight) {
            this.date = date;
            this.weight = weight;
        }

        public String getDate() { return date; }
        public Float getWeight() { return weight; }
        public void setDate(String date) { this.date = date; }
        public void setWeight(Float weight) { this.weight = weight; }
    }

    public static class CalorieDataPoint {
        private String date;
        private Integer intake;
        private Integer burned;
        private Integer net;

        public CalorieDataPoint(String date, Integer intake, Integer burned, Integer net) {
            this.date = date;
            this.intake = intake;
            this.burned = burned;
            this.net = net;
        }

        public String getDate() { return date; }
        public Integer getIntake() { return intake; }
        public Integer getBurned() { return burned; }
        public Integer getNet() { return net; }
        public void setDate(String date) { this.date = date; }
        public void setIntake(Integer intake) { this.intake = intake; }
        public void setBurned(Integer burned) { this.burned = burned; }
        public void setNet(Integer net) { this.net = net; }
    }
}
