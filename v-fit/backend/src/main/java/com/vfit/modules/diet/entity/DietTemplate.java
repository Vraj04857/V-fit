package com.vfit.modules.diet.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_template")
public class DietTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    private Long templateId;

    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    @Column(name = "diet_type", length = 50)
    private String dietType;

    @Column(length = 500)
    private String description;

    @Column(name = "target_calories")
    private Integer targetCalories;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public DietTemplate() {}

    // Getters
    public Long getTemplateId() { return templateId; }
    public String getTemplateName() { return templateName; }
    public String getDietType() { return dietType; }
    public String getDescription() { return description; }
    public Integer getTargetCalories() { return targetCalories; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    public void setDietType(String dietType) { this.dietType = dietType; }
    public void setDescription(String description) { this.description = description; }
    public void setTargetCalories(Integer targetCalories) { this.targetCalories = targetCalories; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}