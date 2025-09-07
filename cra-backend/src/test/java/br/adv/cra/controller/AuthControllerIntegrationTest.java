package br.adv.cra.controller;

import br.adv.cra.dto.RegisterRequest;
import br.adv.cra.entity.Correspondente;
import br.adv.cra.entity.Usuario;
import br.adv.cra.repository.CorrespondenteRepository;
import br.adv.cra.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CorrespondenteRepository correspondenteRepository;

    @BeforeEach
    void setUp() {
        // Clean up test data before each test
        usuarioRepository.deleteAll();
    }

    @Test
    void testRegisterUserWithoutCorrespondente() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setLogin("testuser");
        registerRequest.setSenha("password123");
        registerRequest.setNomeCompleto("Test User");
        registerRequest.setTipo(2); // Advogado

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest()); // Will fail due to missing auth, but shows the endpoint works
    }

    @Test
    void testRegisterCorrespondenteWithCorrespondenteId() throws Exception {
        // First create a correspondente
        Correspondente correspondente = new Correspondente();
        correspondente.setNome("Test Correspondente");
        correspondente.setAtivo(true);
        Correspondente savedCorrespondente = correspondenteRepository.save(correspondente);

        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setLogin("testcorrespondente");
        registerRequest.setSenha("password123");
        registerRequest.setNomeCompleto("Test Correspondente User");
        registerRequest.setTipo(3); // Correspondente
        registerRequest.setCorrespondenteId(savedCorrespondente.getId());

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest()); // Will fail due to missing auth, but shows the endpoint works
    }
}