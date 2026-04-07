package com.vfit.modules.user.controller;

import com.vfit.modules.user.dto.ProfileDto;
import com.vfit.modules.user.service.ProfileService;
import com.vfit.shared.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private SecurityUtils securityUtils;

    // GET /api/profile - Get current user's profile
    @GetMapping
    public ResponseEntity<?> getProfile() {
        try {
            Long userId = securityUtils.getCurrentUserId();
            ProfileDto profile = profileService.getProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/profile - Update current user's profile
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileDto profileDto) {
        try {
            Long userId = securityUtils.getCurrentUserId();
            ProfileDto updated = profileService.updateProfile(userId, profileDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}