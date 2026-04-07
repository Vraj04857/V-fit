package com.vfit.modules.user.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.vfit.modules.user.dto.AuthResponse;
import com.vfit.modules.user.dto.GoogleAuthRequest;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.shared.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final JwtUtil jwtUtil;

    @Value("${google.client-id}")
    private String googleClientId;

    public GoogleAuthService(UserRepository userRepository,
                             ProfileRepository profileRepository,
                             JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        try {
            // Verify the Google token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            if (name == null || name.isEmpty()) {
                name = email.split("@")[0];
            }

            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            String displayName;

            if (existingUser.isPresent()) {
                // Existing user — just log them in
                user = existingUser.get();
                // Get their profile name
                Profile profile = profileRepository.findByUser_UserId(user.getUserId())
                        .orElse(null);
                displayName = (profile != null && profile.getName() != null)
                        ? profile.getName() : name;
            } else {
                // New Google user — auto-register
                user = new User();
                user.setEmail(email);
                user.setPasswordHash("GOOGLE_OAUTH_" + UUID.randomUUID());
                user.setRole("USER");
                user.setIsActive(true);
                user = userRepository.save(user);

                // Create a basic profile
                Profile profile = new Profile();
                profile.setUser(user);
                profile.setName(name);
                profileRepository.save(profile);

                displayName = name;
            }

            // Generate JWT using JwtUtil — same as UserService does
            String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

            return new AuthResponse(
                    token,
                    user.getUserId(),
                    user.getEmail(),
                    displayName,
                    "Welcome to V-Fit!"
            );

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}