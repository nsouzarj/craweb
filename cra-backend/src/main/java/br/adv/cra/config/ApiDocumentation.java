package br.adv.cra.config;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import br.adv.cra.dto.JwtResponse;
import br.adv.cra.dto.LoginRequest;
import br.adv.cra.dto.RefreshTokenRequest;
import br.adv.cra.dto.RegisterRequest;

import java.util.List;
import java.util.Map;

/**
 * Interface de documentação para a API do CRA.
 * Esta interface contém apenas anotações Swagger para documentar a API
 * sem modificar os controllers existentes.
 */
public interface ApiDocumentation {

    // Auth Controller Documentation
    @Tag(name = "auth", description = "Operações de autenticação e autorização")
    @Operation(
        summary = "Autentica um usuário",
        description = "Autentica um usuário com base nas credenciais fornecidas e retorna tokens JWT"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida", 
            content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "400", description = "Credenciais inválidas",
            content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest);

    @Operation(
        summary = "Registra um novo usuário",
        description = "Registra um novo usuário (Apenas administradores)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Registro bem-sucedido", 
            content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "400", description = "Erro no registro",
            content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores")
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest);

    @Operation(
        summary = "Atualiza o token de acesso",
        description = "Atualiza um token JWT expirado usando o token de atualização"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token atualizado com sucesso", 
            content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = JwtResponse.class))),
        @ApiResponse(responseCode = "400", description = "Token inválido",
            content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request);

    @Operation(
        summary = "Obtém informações do usuário atual",
        description = "Recupera informações sobre o usuário autenticado atualmente"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Informações do usuário recuperadas com sucesso", 
            content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "Usuário não encontrado",
            content = @Content(mediaType = "application/json"))
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<?> getCurrentUser();

    @Operation(
        summary = "Realiza logout do usuário",
        description = "Em um ambiente stateless JWT, o logout é tratado no cliente. Este endpoint apenas confirma a operação."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso", 
            content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<?> logoutUser();

    @Operation(
        summary = "Valida o token JWT atual",
        description = "Valida o token JWT atual do usuário autenticado"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token validado com sucesso", 
            content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "Token inválido",
            content = @Content(mediaType = "application/json"))
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<?> validateToken();
    
    // User Controller Documentation
    @Tag(name = "usuario", description = "Operações relacionadas a usuários")
    @Operation(
        summary = "Lista todos os usuários",
        description = "Recupera uma lista de todos os usuários cadastrados no sistema (Apenas administradores)"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de usuários recuperada com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado - apenas administradores")
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<List<Map<String, Object>>> getAllUsers();
    
    // Correspondente Controller Documentation
    @Tag(name = "correspondente", description = "Operações relacionadas a correspondentes")
    @Operation(
        summary = "Lista todos os correspondentes",
        description = "Recupera uma lista de todos os correspondentes cadastrados no sistema"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de correspondentes recuperada com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<List<Map<String, Object>>> getAllCorrespondentes();
    
    // Processo Controller Documentation
    @Tag(name = "processo", description = "Operações relacionadas a processos")
    @Operation(
        summary = "Lista todos os processos",
        description = "Recupera uma lista de todos os processos cadastrados no sistema"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de processos recuperada com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<List<Map<String, Object>>> getAllProcessos();
    
    // Solicitacao Controller Documentation
    @Tag(name = "solicitacao", description = "Operações relacionadas a solicitações")
    @Operation(
        summary = "Lista todas as solicitações",
        description = "Recupera uma lista de todas as solicitações cadastradas no sistema"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de solicitações recuperada com sucesso"),
        @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @SecurityRequirement(name = "bearerAuth")
    ResponseEntity<List<Map<String, Object>>> getAllSolicitacoes();
}