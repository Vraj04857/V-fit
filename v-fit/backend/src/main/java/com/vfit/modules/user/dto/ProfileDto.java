package com.vfit.modules.user.dto;

public class ProfileDto {

    private Long profileId;
    private String name;
    private Integer age;
    private String gender;
    private Float height;
    private Float weight;
    private String fitnessGoal;
    private String dietaryPreference;
    private String activityLevel;
    private String profilePhoto;

    // Constructors
    public ProfileDto() {}

    // Getters
    public Long getProfileId() { return profileId; }
    public String getName() { return name; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public Float getHeight() { return height; }
    public Float getWeight() { return weight; }
    public String getFitnessGoal() { return fitnessGoal; }
    public String getDietaryPreference() { return dietaryPreference; }
    public String getActivityLevel() { return activityLevel; }
    public String getProfilePhoto() { return profilePhoto; }

    // Setters
    public void setProfileId(Long profileId) { this.profileId = profileId; }
    public void setName(String name) { this.name = name; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
    public void setHeight(Float height) { this.height = height; }
    public void setWeight(Float weight) { this.weight = weight; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}