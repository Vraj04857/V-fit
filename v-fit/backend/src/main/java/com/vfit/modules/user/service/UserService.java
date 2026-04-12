package com.vfit.modules.user.service;

import com.vfit.modules.user.dto.*;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.shared.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

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

    @Autowired
    private EmailService emailService;

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

    // UC-03 Forgot Password — sends reset email
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // Always return success even if email not found (security best practice)
        if (user == null) {
            log.warn("Password reset requested for non-existent email: {}", request.getEmail());
            return;
        }

        if (!user.getIsActive()) {
            log.warn("Password reset requested for deactivated account: {}", request.getEmail());
            return;
        }

        // Check if user registered via Google (no password to reset)
        if (user.getPasswordHash().startsWith("GOOGLE_OAUTH_")) {
            log.warn("Password reset requested for Google OAuth user: {}", request.getEmail());
            return;
        }

        // Generate reset token (UUID-based, no collisions)
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

        log.info("Password reset token generated for: {}", request.getEmail());
    }

    // UC-03 Reset Password — validates token and updates password
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Find user by reset token
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        // Check token expiry
        if (user.getResetTokenExpiry() == null || 
            user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            // Clear the expired token
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }

        // Check if new password is different from old
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new RuntimeException("New password must be different from your current password");
        }

        // Update password and clear reset token
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }
}


// package com.vfit.modules.user.service;

// import com.vfit.modules.user.dto.AuthResponse;
// import com.vfit.modules.user.dto.LoginRequest;
// import com.vfit.modules.user.dto.RegisterRequest;
// import com.vfit.modules.user.entity.Profile;
// import com.vfit.modules.user.entity.User;
// import com.vfit.modules.user.repository.ProfileRepository;
// import com.vfit.modules.user.repository.UserRepository;
// import com.vfit.shared.security.JwtUtil;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private ProfileRepository profileRepository;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private AuthenticationManager authenticationManager;

//     // UC-01 Register
//     @Transactional
//     public AuthResponse register(RegisterRequest request) {

//         // Check if email already exists
//         if (userRepository.existsByEmail(request.getEmail())) {
//             throw new RuntimeException("Email already registered");
//         }

//         // Create and save User
//         User user = new User();
//         user.setEmail(request.getEmail());
//         user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
//         user.setRole("USER");
//         user.setIsActive(true);

//         User savedUser = userRepository.save(user);

//         // Create and save Profile
//         Profile profile = new Profile();
//         profile.setUser(savedUser);
//         profile.setName(request.getName());
//         profile.setAge(request.getAge());
//         profile.setGender(request.getGender());

//         profileRepository.save(profile);

//         // Generate JWT
//         String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getUserId());

//         return new AuthResponse(
//                 token,
//                 savedUser.getUserId(),
//                 savedUser.getEmail(),
//                 request.getName(),
//                 "Registration successful! Welcome to V-Fit!"
//         );
//     }

//     // UC-02 Login
//     public AuthResponse login(LoginRequest request) {
//         try {
//             // Authenticate credentials
//             authenticationManager.authenticate(
//                     new UsernamePasswordAuthenticationToken(
//                             request.getEmail(),
//                             request.getPassword()
//                     )
//             );
//         } catch (BadCredentialsException e) {
//             throw new RuntimeException("Invalid email or password");
//         }

//         // Get user from database
//         User user = userRepository.findByEmail(request.getEmail())
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         // Check if account is active
//         if (!user.getIsActive()) {
//             throw new RuntimeException("Account is deactivated. Please contact support.");
//         }

//         // Get profile for name
//         Profile profile = profileRepository.findByUser_UserId(user.getUserId())
//                 .orElseThrow(() -> new RuntimeException("Profile not found"));

//         // Generate JWT token
//         String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

//         return new AuthResponse(
//                 token,
//                 user.getUserId(),
//                 user.getEmail(),
//                 profile.getName(),
//                 "Login successful! Welcome back, " + profile.getName() + "!"
//         );
//     }
// }