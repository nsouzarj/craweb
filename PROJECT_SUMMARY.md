# Sistema CRA - Resumo do Projeto

## Visão Geral
O sistema CRA (Correspondente Responsável por Atos) é uma plataforma de gestão legal com frontend moderno em Angular 18 e backend em Spring Boot 3.2.5. Permite a gestão eficiente de usuários, correspondentes legais, processos e solicitações de serviço com controle de acesso baseado em funções.

## Componentes Principais

### Backend (Spring Boot)
- **Tecnologia**: Java 17, Spring Boot 3.2.5, PostgreSQL
- **Segurança**: Autenticação JWT com controle de acesso baseado em funções
- **Arquitetura**: API RESTful com 9 controladores principais
- **Banco de Dados**: PostgreSQL (produção), H2 (desenvolvimento)

### Frontend (Angular)
- **Tecnologia**: Angular 18 com componentes standalone, Angular Material
- **Recursos**: Design responsivo, dashboard em tempo real, operações CRUD abrangentes
- **Autenticação**: Gerenciamento de tokens JWT com atualização automática
- **Interface**: Componentes modernos do Material Design

## Principais Recursos
1. **Gestão de Usuários**: Operações CRUD completas com atribuição de funções
2. **Gestão de Correspondentes**: Gerenciamento de correspondentes legais com recursos de busca
3. **Gestão de Processos**: Manipulação de processos legais com filtragem avançada
4. **Gestão de Solicitações**: Acompanhamento de solicitações de serviço com gerenciamento de status
5. **Dashboard**: Estatísticas em tempo real e ações rápidas
6. **Controle de Acesso Baseado em Funções**: Três tipos de usuário (Administrador, Advogado, Correspondente) com permissões apropriadas

## Funções de Usuário
- **Administrador (Tipo 1)**: Acesso completo ao sistema
- **Advogado (Tipo 2)**: Gestão de usuários e processos
- **Correspondente (Tipo 3)**: Acesso limitado a processos/solicitações atribuídos

## Destaques Técnicos
- Angular 18 moderno com componentes standalone (sem NgModules)
- Spring Boot 3.2.5 com migração para Jakarta EE
- Autenticação baseada em JWT com mecanismo de atualização de token
- Documentação abrangente da API
- Design responsivo para desktop e mobile
- Carregamento preguiçoso para otimização de desempenho

## Credenciais Padrão
- Administrador: `admin` / `admin123`
- Advogado: `advogado1` / `adv123`
- Correspondente: `corresp1` / `corresp123`

## Início Rápido
1. Iniciar backend: `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
2. Iniciar frontend: `npm start`
3. Acessar aplicação em `http://localhost:4200`