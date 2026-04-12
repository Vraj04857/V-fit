package com.vfit.modules.user.controller;

import com.vfit.modules.user.dto.*;
import com.vfit.modules.user.service.UserService;
import com.vfit.modules.user.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private GoogleAuthService googleAuthService;

    // UC-01: Register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }

    // UC-02: Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }

    // Google OAuth Login
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = googleAuthService.authenticateWithGoogle(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, null, e.getMessage()));
        }
    }

    // UC-03: Forgot Password — sends reset email
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            userService.forgotPassword(request);
            // Always return success (security: don't reveal if email exists)
            return ResponseEntity.ok(Map.of(
                    "message", "If an account with that email exists, a reset link has been sent."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of(
                    "message", "If an account with that email exists, a reset link has been sent."
            ));
        }
    }

    // UC-03: Reset Password — validates token and updates password
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Password has been reset successfully. You can now log in."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    // Health test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("V-Fit Auth API is working!");
    }
}


// package com.vfit.modules.user.controller;

// import com.vfit.modules.user.dto.AuthResponse;
// import com.vfit.modules.user.dto.LoginRequest;
// import com.vfit.modules.user.dto.RegisterRequest;
// import com.vfit.modules.user.service.UserService;
// import jakarta.validation.Valid;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import com.vfit.modules.user.dto.GoogleAuthRequest;
// import com.vfit.modules.user.service.GoogleAuthService;

// @RestController
// @RequestMapping("/auth")
// @CrossOrigin(origins = "*")
// public class AuthController {

//     @Autowired
//     private UserService userService;
//     @Autowired
//     private GoogleAuthService googleAuthService;

//     // UC-01: Register
//     @PostMapping("/register")
//     public ResponseEntity<AuthResponse> register(
//             @Valid @RequestBody RegisterRequest request) {
//         try {
//             AuthResponse response = userService.register(request);
//             return ResponseEntity.status(HttpStatus.CREATED).body(response);
//         } catch (RuntimeException e) {
//             return ResponseEntity.badRequest()
//                     .body(new AuthResponse(null, null, null, null, e.getMessage()));
//         }
//     }

//     // UC-02: Login
//     @PostMapping("/login")
//     public ResponseEntity<AuthResponse> login(
//             @Valid @RequestBody LoginRequest request) {
//         try {
//             AuthResponse response = userService.login(request);
//             return ResponseEntity.ok(response);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body(new AuthResponse(null, null, null, null, e.getMessage()));
//         }
//     }

//     //Google Auth
//     @PostMapping("/google")
//     public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
//         try {
//             AuthResponse response = googleAuthService.authenticateWithGoogle(request);
//             return ResponseEntity.ok(response);
//         } catch (RuntimeException e) {
//         return ResponseEntity.status(401).build();
//         }
//     }


//     // Health test endpoint
//     @GetMapping("/test")
//     public ResponseEntity<String> test() {
//         return ResponseEntity.ok("✅ V-Fit Auth API is working!");
//     }
// }