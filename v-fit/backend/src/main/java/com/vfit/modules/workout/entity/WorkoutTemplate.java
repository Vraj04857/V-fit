package com.vfit.modules.workout.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_template")
public class WorkoutTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    private Long templateId;

    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    @Column(name = "goal_category", length = 50)
    private String goalCategory;

    @Column(name = "difficulty_level", length = 20)
    private String difficultyLevel;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public WorkoutTemplate() {}

    // Getters
    public Long getTemplateId() { return templateId; }
    public String getTemplateName() { return templateName; }
    public String getGoalCategory() { return goalCategory; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    public void setGoalCategory(String goalCategory) { this.goalCategory = goalCategory; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}