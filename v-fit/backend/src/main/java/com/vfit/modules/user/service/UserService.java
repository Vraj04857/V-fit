package com.vfit.modules.user.service;

import com.vfit.modules.user.dto.AuthResponse;
import com.vfit.modules.user.dto.LoginRequest;
import com.vfit.modules.user.dto.RegisterRequest;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.shared.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // UC-01 Register
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create and save User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create and save Profile
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setName(request.getName());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());

        profileRepository.save(profile);

        // Generate JWT
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getUserId());

        return new AuthResponse(
                token,
                savedUser.getUserId(),
                savedUser.getEmail(),
                request.getName(),
                "Registration successful! Welcome to V-Fit!"
        );
    }

    // UC-02 Login
    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }

        // Get user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if account is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated. Please contact support.");
        }

        // Get profile for name
        Profile profile = profileRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getEmail(),
                profile.getName(),
                "Login successful! Welcome back, " + profile.getName() + "!"
        );
    }
}