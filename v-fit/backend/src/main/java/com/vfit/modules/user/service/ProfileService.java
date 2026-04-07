package com.vfit.modules.user.service;

import com.vfit.modules.user.dto.ProfileDto;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    // Get profile by userId
    public ProfileDto getProfile(Long userId) {
        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapToDto(profile);
    }

    // UC-03: Update Profile
    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileDto profileDto) {

        Profile profile = profileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Validate height and weight
        if (profileDto.getHeight() != null &&
                (profileDto.getHeight() < 50 || profileDto.getHeight() > 300)) {
            throw new RuntimeException("Invalid height value");
        }
        if (profileDto.getWeight() != null &&
                (profileDto.getWeight() < 20 || profileDto.getWeight() > 500)) {
            throw new RuntimeException("Invalid weight value");
        }

        // Update fields
        if (profileDto.getName() != null) profile.setName(profileDto.getName());
        if (profileDto.getAge() != null) profile.setAge(profileDto.getAge());
        if (profileDto.getGender() != null) profile.setGender(profileDto.getGender());
        if (profileDto.getHeight() != null) profile.setHeight(profileDto.getHeight());
        if (profileDto.getWeight() != null) profile.setWeight(profileDto.getWeight());
        if (profileDto.getFitnessGoal() != null) profile.setFitnessGoal(profileDto.getFitnessGoal());
        if (profileDto.getDietaryPreference() != null) profile.setDietaryPreference(profileDto.getDietaryPreference());
        if (profileDto.getActivityLevel() != null) profile.setActivityLevel(profileDto.getActivityLevel());

        Profile updated = profileRepository.save(profile);
        return mapToDto(updated);
    }

    // Map Entity to DTO
    private ProfileDto mapToDto(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setProfileId(profile.getProfileId());
        dto.setName(profile.getName());
        dto.setAge(profile.getAge());
        dto.setGender(profile.getGender());
        dto.setHeight(profile.getHeight());
        dto.setWeight(profile.getWeight());
        dto.setFitnessGoal(profile.getFitnessGoal());
        dto.setDietaryPreference(profile.getDietaryPreference());
        dto.setActivityLevel(profile.getActivityLevel());
        dto.setProfilePhoto(profile.getProfilePhoto());
        return dto;
    }
}