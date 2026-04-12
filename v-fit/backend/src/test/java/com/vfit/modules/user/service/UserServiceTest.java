package com.vfit.modules.user.service;

import com.vfit.modules.user.dto.*;
import com.vfit.modules.user.entity.Profile;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.shared.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ProfileRepository profileRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailService emailService;

    @InjectMocks
    private UserService userService;

    // ============================================================
    // UC-01: Registration Tests
    // ============================================================
    @Nested
    @DisplayName("UC-01: Registration")
    class RegistrationTests {

        private RegisterRequest validRequest;

        @BeforeEach
        void setUp() {
            validRequest = new RegisterRequest();
            validRequest.setName("Vraj");
            validRequest.setEmail("vraj@example.com");
            validRequest.setPassword("StrongPass@123");
            validRequest.setAge(25);
            validRequest.setGender("Male");
        }

        @Test
        @DisplayName("REG-01: Successful registration returns token and user info")
        void register_Success() {
            // Arrange
            when(userRepository.existsByEmail("vraj@example.com")).thenReturn(false);
            when(passwordEncoder.encode("StrongPass@123")).thenReturn("$2a$encoded");

            User savedUser = new User();
            savedUser.setUserId(1L);
            savedUser.setEmail("vraj@example.com");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(profileRepository.save(any(Profile.class))).thenReturn(new Profile());
            when(jwtUtil.generateToken("vraj@example.com", 1L)).thenReturn("jwt-token-abc");

            // Act
            AuthResponse response = userService.register(validRequest);

            // Assert
            assertNotNull(response);
            assertEquals("jwt-token-abc", response.getToken());
            assertEquals(1L, response.getUserId());
            assertEquals("vraj@example.com", response.getEmail());
            assertEquals("Vraj", response.getName());
            assertTrue(response.getMessage().contains("Registration successful"));

            verify(userRepository).save(any(User.class));
            verify(profileRepository).save(any(Profile.class));
        }

        @Test
        @DisplayName("REG-02: Duplicate email throws exception")
        void register_DuplicateEmail() {
            when(userRepository.existsByEmail("vraj@example.com")).thenReturn(true);

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.register(validRequest));

            assertEquals("Email already registered", ex.getMessage());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("REG-03: Password is encoded before saving")
        void register_PasswordEncoded() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode("StrongPass@123")).thenReturn("$2a$encoded");

            User savedUser = new User();
            savedUser.setUserId(1L);
            savedUser.setEmail("vraj@example.com");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User u = invocation.getArgument(0);
                assertEquals("$2a$encoded", u.getPasswordHash());
                u.setUserId(1L);
                return u;
            });
            when(profileRepository.save(any(Profile.class))).thenReturn(new Profile());
            when(jwtUtil.generateToken(anyString(), anyLong())).thenReturn("token");

            userService.register(validRequest);

            verify(passwordEncoder).encode("StrongPass@123");
        }

        @Test
        @DisplayName("REG-04: Profile created with correct fields")
        void register_ProfileCreatedCorrectly() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$encoded");

            User savedUser = new User();
            savedUser.setUserId(1L);
            savedUser.setEmail("vraj@example.com");
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> {
                Profile p = invocation.getArgument(0);
                assertEquals("Vraj", p.getName());
                assertEquals(25, p.getAge());
                assertEquals("Male", p.getGender());
                return p;
            });
            when(jwtUtil.generateToken(anyString(), anyLong())).thenReturn("token");

            userService.register(validRequest);

            verify(profileRepository).save(any(Profile.class));
        }
    }

    // ============================================================
    // UC-02: Login Tests
    // ============================================================
    @Nested
    @DisplayName("UC-02: Login")
    class LoginTests {

        private LoginRequest validLogin;
        private User existingUser;
        private Profile existingProfile;

        @BeforeEach
        void setUp() {
            validLogin = new LoginRequest();
            validLogin.setEmail("vraj@example.com");
            validLogin.setPassword("StrongPass@123");

            existingUser = new User();
            existingUser.setUserId(1L);
            existingUser.setEmail("vraj@example.com");
            existingUser.setPasswordHash("$2a$encoded");
            existingUser.setIsActive(true);

            existingProfile = new Profile();
            existingProfile.setName("Vraj");
            existingProfile.setUser(existingUser);
        }

        @Test
        @DisplayName("LOG-01: Successful login returns token")
        void login_Success() {
            when(authenticationManager.authenticate(any())).thenReturn(null);
            when(userRepository.findByEmail("vraj@example.com")).thenReturn(Optional.of(existingUser));
            when(profileRepository.findByUser_UserId(1L)).thenReturn(Optional.of(existingProfile));
            when(jwtUtil.generateToken("vraj@example.com", 1L)).thenReturn("jwt-token");

            AuthResponse response = userService.login(validLogin);

            assertNotNull(response);
            assertEquals("jwt-token", response.getToken());
            assertEquals("Vraj", response.getName());
            assertTrue(response.getMessage().contains("Welcome back"));
        }

        @Test
        @DisplayName("LOG-02: Wrong password throws exception")
        void login_WrongPassword() {
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.login(validLogin));

            assertEquals("Invalid email or password", ex.getMessage());
        }

        @Test
        @DisplayName("LOG-03: Non-existent email throws exception")
        void login_UserNotFound() {
            when(authenticationManager.authenticate(any())).thenReturn(null);
            when(userRepository.findByEmail("vraj@example.com")).thenReturn(Optional.empty());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.login(validLogin));

            assertEquals("User not found", ex.getMessage());
        }

        @Test
        @DisplayName("LOG-04: Deactivated account throws exception")
        void login_DeactivatedAccount() {
            existingUser.setIsActive(false);
            when(authenticationManager.authenticate(any())).thenReturn(null);
            when(userRepository.findByEmail("vraj@example.com")).thenReturn(Optional.of(existingUser));

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.login(validLogin));

            assertTrue(ex.getMessage().contains("deactivated"));
        }
    }

    // ============================================================
    // UC-03: Forgot Password Tests
    // ============================================================
    @Nested
    @DisplayName("UC-03: Forgot Password")
    class ForgotPasswordTests {

        @Test
        @DisplayName("PSW-01: Valid email sends reset email")
        void forgotPassword_ValidEmail() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("vraj@example.com");

            User user = new User();
            user.setUserId(1L);
            user.setEmail("vraj@example.com");
            user.setPasswordHash("$2a$encoded");
            user.setIsActive(true);

            when(userRepository.findByEmail("vraj@example.com")).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            userService.forgotPassword(request);

            verify(emailService).sendPasswordResetEmail(eq("vraj@example.com"), anyString());
            verify(userRepository).save(argThat(u -> 
                u.getResetToken() != null && u.getResetTokenExpiry() != null
            ));
        }

        @Test
        @DisplayName("PSW-02: Non-existent email does not throw (security)")
        void forgotPassword_NonExistentEmail() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("nobody@example.com");

            when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

            // Should NOT throw — security best practice
            assertDoesNotThrow(() -> userService.forgotPassword(request));
            verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
        }

        @Test
        @DisplayName("PSW-03: Google OAuth user does not receive reset email")
        void forgotPassword_GoogleOAuthUser() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("google@example.com");

            User googleUser = new User();
            googleUser.setEmail("google@example.com");
            googleUser.setPasswordHash("GOOGLE_OAUTH_some-uuid");
            googleUser.setIsActive(true);

            when(userRepository.findByEmail("google@example.com")).thenReturn(Optional.of(googleUser));

            userService.forgotPassword(request);

            verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
        }

        @Test
        @DisplayName("PSW-04: Deactivated account does not receive reset email")
        void forgotPassword_DeactivatedAccount() {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail("inactive@example.com");

            User inactiveUser = new User();
            inactiveUser.setEmail("inactive@example.com");
            inactiveUser.setPasswordHash("$2a$encoded");
            inactiveUser.setIsActive(false);

            when(userRepository.findByEmail("inactive@example.com")).thenReturn(Optional.of(inactiveUser));

            userService.forgotPassword(request);

            verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
        }
    }

    // ============================================================
    // UC-03: Reset Password Tests
    // ============================================================
    @Nested
    @DisplayName("UC-03: Reset Password")
    class ResetPasswordTests {

        private User userWithToken;

        @BeforeEach
        void setUp() {
            userWithToken = new User();
            userWithToken.setUserId(1L);
            userWithToken.setEmail("vraj@example.com");
            userWithToken.setPasswordHash("$2a$old-hash");
            userWithToken.setResetToken("valid-token-123");
            userWithToken.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userWithToken.setIsActive(true);
        }

        @Test
        @DisplayName("RST-01: Valid token and matching passwords resets successfully")
        void resetPassword_Success() {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token-123");
            request.setNewPassword("NewPass@123");
            request.setConfirmPassword("NewPass@123");

            when(userRepository.findByResetToken("valid-token-123"))
                    .thenReturn(Optional.of(userWithToken));
            when(passwordEncoder.matches("NewPass@123", "$2a$old-hash")).thenReturn(false);
            when(passwordEncoder.encode("NewPass@123")).thenReturn("$2a$new-hash");
            when(userRepository.save(any(User.class))).thenReturn(userWithToken);

            assertDoesNotThrow(() -> userService.resetPassword(request));

            verify(userRepository).save(argThat(u ->
                u.getResetToken() == null && u.getResetTokenExpiry() == null
            ));
        }

        @Test
        @DisplayName("RST-02: Password mismatch throws exception")
        void resetPassword_PasswordMismatch() {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token-123");
            request.setNewPassword("NewPass@123");
            request.setConfirmPassword("DifferentPass@123");

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.resetPassword(request));

            assertEquals("Passwords do not match", ex.getMessage());
        }

        @Test
        @DisplayName("RST-03: Invalid token throws exception")
        void resetPassword_InvalidToken() {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("invalid-token");
            request.setNewPassword("NewPass@123");
            request.setConfirmPassword("NewPass@123");

            when(userRepository.findByResetToken("invalid-token")).thenReturn(Optional.empty());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.resetPassword(request));

            assertTrue(ex.getMessage().contains("Invalid or expired"));
        }

        @Test
        @DisplayName("RST-04: Expired token throws exception")
        void resetPassword_ExpiredToken() {
            userWithToken.setResetTokenExpiry(LocalDateTime.now().minusMinutes(10));

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token-123");
            request.setNewPassword("NewPass@123");
            request.setConfirmPassword("NewPass@123");

            when(userRepository.findByResetToken("valid-token-123"))
                    .thenReturn(Optional.of(userWithToken));

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.resetPassword(request));

            assertTrue(ex.getMessage().contains("expired"));
        }

        @Test
        @DisplayName("RST-05: Same as old password throws exception")
        void resetPassword_SameAsOldPassword() {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token-123");
            request.setNewPassword("OldPass@123");
            request.setConfirmPassword("OldPass@123");

            when(userRepository.findByResetToken("valid-token-123"))
                    .thenReturn(Optional.of(userWithToken));
            when(passwordEncoder.matches("OldPass@123", "$2a$old-hash")).thenReturn(true);

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> userService.resetPassword(request));

            assertTrue(ex.getMessage().contains("different"));
        }
    }
}