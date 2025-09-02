package br.adv.cra.controller;

import br.adv.cra.dto.JwtResponse;
import br.adv.cra.dto.LoginRequest;
import br.adv.cra.service.AuthService;
import br.adv.cra.service.DatabaseConnectionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Using a standalone approach to avoid Spring context loading issues
class AuthControllerIntegrationTest {
    
    private MockMvc mockMvc;
    
    // Manually create mocks
    private AuthService authService;
    private DatabaseConnectionService databaseConnectionService;
    private ObjectMapper objectMapper;
    
    @BeforeEach
    void setUp() {
        // Manually create mocks
        authService = mock(AuthService.class);
        databaseConnectionService = mock(DatabaseConnectionService.class);
        objectMapper = new ObjectMapper();
        
        // Manually create the controller and mockMvc
        AuthController authController = new AuthController(authService, databaseConnectionService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }
    
    @Test
    void testLoginWithValidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLogin("testuser");
        loginRequest.setSenha("testpass");
        
        JwtResponse jwtResponse = new JwtResponse(
            "test-jwt-token",
            "test-refresh-token",
            "Bearer",
            1L,
            "testuser",
            "Test User",
            "test@example.com",
            2,
            List.of("ROLE_ADVOGADO"),
            LocalDateTime.now().plusHours(24)
        );
        
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(jwtResponse);
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.refreshToken").value("test-refresh-token"))
                .andExpect(jsonPath("$.login").value("testuser"))
                .andExpect(jsonPath("$.nomeCompleto").value("Test User"))
                .andExpect(jsonPath("$.tipo").value(2))
                .andExpect(jsonPath("$.roles").isArray());
                
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
    
    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setLogin("testuser");
        loginRequest.setSenha("wrongpass");
        
        when(authService.authenticate(any(LoginRequest.class)))
            .thenThrow(new RuntimeException("Credenciais inválidas"));
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Credenciais inválidas"));
                
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
    
    @Test
    void testLogout() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));
    }
}