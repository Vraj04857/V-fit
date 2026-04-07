package com.vfit.modules.user.controller;

import com.vfit.modules.user.dto.AuthResponse;
import com.vfit.modules.user.dto.LoginRequest;
import com.vfit.modules.user.dto.RegisterRequest;
import com.vfit.modules.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vfit.modules.user.dto.GoogleAuthRequest;
import com.vfit.modules.user.service.GoogleAuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;
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

    //Google Auth
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = googleAuthService.authenticateWithGoogle(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
        return ResponseEntity.status(401).build();
        }
    }


    // Health test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ V-Fit Auth API is working!");
    }
}