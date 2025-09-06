package br.adv.cra.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;

@OpenAPIDefinition(
    info = @Info(
        title = "CRA Backend API",
        version = "1.0",
        description = "Documentação da API do Backend do CRA"
    ),
    servers = {
        @Server(url = "/cra-api", description = "Servidor de desenvolvimento")
    },
    tags = {
        @Tag(name = "auth", description = "Operações de autenticação e autorização"),
        @Tag(name = "comarca", description = "Operações relacionadas a comarcas"),
        @Tag(name = "correspondente", description = "Operações relacionadas a correspondentes"),
        @Tag(name = "orgao", description = "Operações relacionadas a órgãos"),
        @Tag(name = "processo", description = "Operações relacionadas a processos"),
        @Tag(name = "solicitacao", description = "Operações relacionadas a solicitações"),
        @Tag(name = "status-solicitacao", description = "Operações relacionadas ao status de solicitações"),
        @Tag(name = "tipo-solicitacao", description = "Operações relacionadas aos tipos de solicitações"),
        @Tag(name = "uf", description = "Operações relacionadas às unidades federativas"),
        @Tag(name = "usuario", description = "Operações relacionadas a usuários")
    }
)
public class SwaggerDocumentationConfig {
    // Esta classe serve apenas para configuração da documentação Swagger
}