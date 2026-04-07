package com.vfit.modules.user.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "profile")
@EntityListeners(AuditingEntityListener.class)
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    private Integer age;

    @Column(length = 10)
    private String gender;

    private Float height;
    private Float weight;

    @Column(name = "fitness_goal", length = 50)
    private String fitnessGoal;

    @Column(name = "dietary_preference", length = 50)
    private String dietaryPreference;

    @Column(name = "activity_level", length = 50)
    private String activityLevel;

    @Column(name = "profile_photo", length = 255)
    private String profilePhoto;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ✅ Constructors
    public Profile() {}

    // ✅ Getters
    public Long getProfileId() { return profileId; }
    public User getUser() { return user; }
    public String getName() { return name; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public Float getHeight() { return height; }
    public Float getWeight() { return weight; }
    public String getFitnessGoal() { return fitnessGoal; }
    public String getDietaryPreference() { return dietaryPreference; }
    public String getActivityLevel() { return activityLevel; }
    public String getProfilePhoto() { return profilePhoto; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ✅ Setters
    public void setProfileId(Long profileId) { this.profileId = profileId; }
    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
    public void setHeight(Float height) { this.height = height; }
    public void setWeight(Float weight) { this.weight = weight; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}