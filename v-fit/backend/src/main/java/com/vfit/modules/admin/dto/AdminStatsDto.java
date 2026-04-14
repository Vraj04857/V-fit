package com.vfit.modules.admin.dto;

public class AdminStatsDto {

    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long totalExercises;
    private long totalFoods;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalUsers, long activeUsers, long inactiveUsers,
                        long totalExercises, long totalFoods) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalExercises = totalExercises;
        this.totalFoods = totalFoods;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
    public long getTotalExercises() { return totalExercises; }
    public long getTotalFoods() { return totalFoods; }

    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public void setInactiveUsers(long inactiveUsers) { this.inactiveUsers = inactiveUsers; }
    public void setTotalExercises(long totalExercises) { this.totalExercises = totalExercises; }
    public void setTotalFoods(long totalFoods) { this.totalFoods = totalFoods; }
}