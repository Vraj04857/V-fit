package com.vfit.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vfit.config.TestConfig;
import com.vfit.modules.user.dto.ForgotPasswordRequest;
import com.vfit.modules.user.dto.LoginRequest;
import com.vfit.modules.user.dto.RegisterRequest;
import com.vfit.modules.user.dto.ResetPasswordRequest;
import com.vfit.modules.user.entity.User;
import com.vfit.modules.user.repository.ProfileRepository;
import com.vfit.modules.user.repository.UserRepository;
import com.vfit.modules.user.service.EmailService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerIntegrationTest {

@Autowired private MockMvc mockMvc;
@Autowired private ObjectMapper objectMapper;
@Autowired private UserRepository userRepository;
@Autowired private ProfileRepository profileRepository;
@Autowired private EmailService emailService;

@BeforeEach
void setUp() {
        profileRepository.deleteAll();
        userRepository.deleteAll();
        reset(emailService);
}

    // ============================================================
    // Registration Integration Tests
    // ============================================================
@Test
@Order(1)
@DisplayName("IT-REG-01: Full registration flow — creates user and returns JWT")
void register_FullFlow_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Vraj");
        request.setEmail("vraj@test.com");
        request.setPassword("StrongPass@123");
        request.setAge(25);
        request.setGender("Male");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.userId").isNumber())
                .andExpect(jsonPath("$.email").value("vraj@test.com"))
                .andExpect(jsonPath("$.name").value("Vraj"))
                .andExpect(jsonPath("$.message", containsString("Registration successful")));

        // Verify user actually persisted in DB
        assertTrue(userRepository.existsByEmail("vraj@test.com"));
    }

    @Test
    @Order(2)
    @DisplayName("IT-REG-02: Duplicate email returns 400")
    void register_DuplicateEmail_Returns400() throws Exception {
        // Register first user
        RegisterRequest first = new RegisterRequest();
        first.setName("User1");
        first.setEmail("dupe@test.com");
        first.setPassword("StrongPass@123");
        first.setAge(25);
        first.setGender("Male");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        // Try to register same email
        RegisterRequest second = new RegisterRequest();
        second.setName("User2");
        second.setEmail("dupe@test.com");
        second.setPassword("AnotherPass@123");
        second.setAge(30);
        second.setGender("Female");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(second)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already registered")));
    }

    @Test
    @Order(3)
    @DisplayName("IT-REG-03: Missing required fields returns 400")
    void register_MissingFields_Returns400() throws Exception {
        // Empty request body
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    // ============================================================
    // Login Integration Tests
    // ============================================================
    @Test
    @Order(4)
    @DisplayName("IT-LOG-01: Full login flow — register then login returns JWT")
    void login_FullFlow_Success() throws Exception {
        // First register
        RegisterRequest reg = new RegisterRequest();
        reg.setName("LoginUser");
        reg.setEmail("login@test.com");
        reg.setPassword("LoginPass@123");
        reg.setAge(28);
        reg.setGender("Male");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        // Now login
        LoginRequest login = new LoginRequest();
        login.setEmail("login@test.com");
        login.setPassword("LoginPass@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("login@test.com"))
                .andExpect(jsonPath("$.name").value("LoginUser"));
    }

    @Test
    @Order(5)
    @DisplayName("IT-LOG-02: Wrong password returns 401")
    void login_WrongPassword_Returns401() throws Exception {
        // Register first
        RegisterRequest reg = new RegisterRequest();
        reg.setName("WrongPwUser");
        reg.setEmail("wrongpw@test.com");
        reg.setPassword("CorrectPass@123");
        reg.setAge(25);
        reg.setGender("Female");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        // Login with wrong password
        LoginRequest login = new LoginRequest();
        login.setEmail("wrongpw@test.com");
        login.setPassword("WrongPass@999");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("Invalid")));
    }

    @Test
    @Order(6)
    @DisplayName("IT-LOG-03: Non-existent email returns 401")
    void login_NonExistentEmail_Returns401() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("nobody@test.com");
        login.setPassword("SomePass@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    // ============================================================
    // Forgot / Reset Password Integration Tests
    // ============================================================
    @Test
    @Order(7)
    @DisplayName("IT-PSW-01: Forgot password sends email and reset works end-to-end")
    void forgotAndResetPassword_FullFlow() throws Exception {
        // 1. Register a user
        RegisterRequest reg = new RegisterRequest();
        reg.setName("ResetUser");
        reg.setEmail("reset@test.com");
        reg.setPassword("OldPass@123");
        reg.setAge(25);
        reg.setGender("Male");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        // 2. Request forgot password
        doNothing().when(emailService).sendPasswordResetEmail(anyString(), anyString());

        ForgotPasswordRequest forgot = new ForgotPasswordRequest();
        forgot.setEmail("reset@test.com");

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgot)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("reset link has been sent")));

        verify(emailService).sendPasswordResetEmail(eq("reset@test.com"), anyString());

        // 3. Get the reset token from DB
        User user = userRepository.findByEmail("reset@test.com").orElseThrow();
        assertNotNull(user.getResetToken());
        assertNotNull(user.getResetTokenExpiry());

        String resetToken = user.getResetToken();

        // 4. Reset password with the token
        ResetPasswordRequest resetReq = new ResetPasswordRequest();
        resetReq.setToken(resetToken);
        resetReq.setNewPassword("NewPass@456");
        resetReq.setConfirmPassword("NewPass@456");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("reset successfully")));

        // 5. Verify token is cleared
        User updatedUser = userRepository.findByEmail("reset@test.com").orElseThrow();
        assertNull(updatedUser.getResetToken());
        assertNull(updatedUser.getResetTokenExpiry());

        // 6. Login with new password
        LoginRequest loginNew = new LoginRequest();
        loginNew.setEmail("reset@test.com");
        loginNew.setPassword("NewPass@456");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginNew)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        // 7. Old password should NOT work
        LoginRequest loginOld = new LoginRequest();
        loginOld.setEmail("reset@test.com");
        loginOld.setPassword("OldPass@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginOld)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(8)
    @DisplayName("IT-PSW-02: Forgot password with non-existent email still returns 200")
    void forgotPassword_NonExistentEmail_StillReturns200() throws Exception {
        ForgotPasswordRequest forgot = new ForgotPasswordRequest();
        forgot.setEmail("ghost@test.com");

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgot)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("reset link")));

        // Email should NOT be sent
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    @Order(9)
    @DisplayName("IT-PSW-03: Reset with invalid token returns 400")
    void resetPassword_InvalidToken_Returns400() throws Exception {
        ResetPasswordRequest resetReq = new ResetPasswordRequest();
        resetReq.setToken("completely-fake-token");
        resetReq.setNewPassword("NewPass@123");
        resetReq.setConfirmPassword("NewPass@123");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid or expired")));
    }

    @Test
    @Order(10)
    @DisplayName("IT-PSW-04: Reset with mismatched passwords returns 400")
    void resetPassword_MismatchedPasswords_Returns400() throws Exception {
        ResetPasswordRequest resetReq = new ResetPasswordRequest();
        resetReq.setToken("some-token");
        resetReq.setNewPassword("NewPass@123");
        resetReq.setConfirmPassword("DifferentPass@456");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("do not match")));
    }

    // ============================================================
    // JWT Token Validation Tests
    // ============================================================
    @Test
    @Order(11)
    @DisplayName("IT-JWT-01: Accessing protected endpoint without token returns 403")
    void protectedEndpoint_NoToken_Returns403() throws Exception {
        mockMvc.perform(get("/profile"))
                .andExpect(status().isForbidden());
    }

@Test
@Order(12)
@DisplayName("IT-JWT-02: Accessing protected endpoint with valid token succeeds")
void protectedEndpoint_WithValidToken_Succeeds() throws Exception {
        // Register & login to get token
        RegisterRequest reg = new RegisterRequest();
        reg.setName("TokenUser");
        reg.setEmail("token@test.com");
        reg.setPassword("TokenPass@123");
        reg.setAge(25);
        reg.setGender("Male");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail("token@test.com");
        login.setPassword("TokenPass@123");

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();

        // Access protected endpoint with token
        mockMvc.perform(get("/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

@Test
@Order(13)
@DisplayName("IT-JWT-03: Accessing protected endpoint with invalid token returns 403")
void protectedEndpoint_InvalidToken_Returns403() throws Exception {
        mockMvc.perform(get("/profile")
                .header("Authorization", "InvalidHeaderNoBearer"))
                .andExpect(status().isForbidden());
}
// ============================================================
// Health Check
// ============================================================
    @Test
    @Order(14)
    @DisplayName("IT-HEALTH-01: Auth test endpoint responds")
    void healthCheck() throws Exception {
        mockMvc.perform(get("/auth/test"))
                .andExpect(status().isOk());
    }
}