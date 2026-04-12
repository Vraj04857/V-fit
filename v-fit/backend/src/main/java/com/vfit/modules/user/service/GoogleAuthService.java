package com.vfit.modules.user.service;

import com.vfit.modules.user.dto.AuthResponse;
import com.vfit.modules.user.dto.GoogleAuthRequest;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.shared.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthService.class);

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final JwtUtil jwtUtil;
    private final WebClient webClient;

    public GoogleAuthService(UserRepository userRepository,
                            ProfileRepository profileRepository,
                            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jwtUtil = jwtUtil;
        this.webClient = WebClient.builder().build();
    }

    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        try {
            log.info("Google auth attempt — verifying access token with Google userinfo API");

            // Use the access_token to call Google's userinfo endpoint
            // This is the correct approach when frontend uses useGoogleLogin() 
            // which returns an access_token (NOT an ID token)
            Map<String, Object> userInfo = webClient.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .headers(h -> h.setBearerAuth(request.getCredential()))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (userInfo == null || !userInfo.containsKey("email")) {
                throw new RuntimeException("Failed to retrieve user info from Google");
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            if (name == null || name.isEmpty()) {
                name = email.split("@")[0];
            }

            log.info("Google auth — verified email: {}", email);

            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            String displayName;

            if (existingUser.isPresent()) {
                // Existing user — just log them in
                user = existingUser.get();

                if (!user.getIsActive()) {
                    throw new RuntimeException("Account is deactivated. Please contact support.");
                }

                // Get their profile name
                Profile profile = profileRepository.findByUser_UserId(user.getUserId())
                        .orElse(null);
                displayName = (profile != null && profile.getName() != null)
                        ? profile.getName() : name;

                log.info("Google auth — existing user login: {}", email);
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

                log.info("Google auth — new user registered: {}", email);
            }

            // Generate JWT
            String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

            return new AuthResponse(
                    token,
                    user.getUserId(),
                    user.getEmail(),
                    displayName,
                    "Welcome to V-Fit!"
            );

        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}