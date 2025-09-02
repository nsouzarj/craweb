# Sistema CRA - Gestão de Correspondentes Legais

Um sistema completo de gestão de correspondentes legais com frontend moderno em Angular 18 e backend em Spring Boot 3.2.5.

## 🏢 Visão Geral

O sistema CRA (Correspondente Responsável por Atos) é uma plataforma abrangente de gestão legal que permite que administradores, advogados e correspondentes gerenciem processos legais, usuários e solicitações de serviço. O sistema implementa controle de acesso baseado em funções com autenticação JWT.

## 🚀 Principais Recursos

### Autenticação e Autorização
- Autenticação baseada em JWT com controle de acesso baseado em funções
- Mecanismo de atualização de token
- Rotas e endpoints de API protegidos
- Três tipos de usuário: Administrador, Advogado e Correspondente

### Gestão de Usuários (Administrador/Advogado)
- Operações CRUD completas para usuários
- Ativação/desativação de usuários
- Atribuição e gerenciamento de funções

### Gestão de Correspondentes
- Operações CRUD completas para correspondentes legais
- Pesquisa por OAB, CPF/CNPJ, nome ou tipo
- Gerenciamento de endereços
- Controle de status de ativação

### Gestão de Processos
- Criação e gerenciamento de processos legais
- Pesquisa por número do processo, nomes das partes, assunto
- Filtragem por status, comarca ou órgão
- Estatísticas de processos no dashboard

### Gestão de Solicitações
- Criação e acompanhamento de solicitações de serviço
- Vinculação de solicitações a processos e correspondentes
- Acompanhamento de status (Pendente, Em Andamento, Finalizada, Cancelada)
- Gerenciamento de prazos e identificação de atrasos

### Dashboard
- Visão geral de estatísticas em tempo real
- Ações rápidas e resumos
- Representação visual de dados

## 🛠️ Stack de Tecnologia

### Frontend (Angular 18)
- **Framework**: Angular 18 com componentes standalone
- **Biblioteca UI**: Angular Material + CDK
- **Linguagem**: TypeScript (modo estrito)
- **Gerenciamento de Estado**: Gerenciamento de estado baseado em serviço
- **Programação Reativa**: RxJS
- **Estilização**: SCSS

### Backend (Spring Boot 3.2.5)
- **Linguagem**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Segurança**: Spring Security com JWT
- **Dados**: Spring Data JPA
- **Banco de Dados**: PostgreSQL (produção), H2 (desenvolvimento)
- **Ferramenta de Build**: Maven
- **Documentação da API**: API REST abrangente com JavaDoc

## 📋 Pré-requisitos

### Backend
- Java 17 ou superior
- Maven 3.6 ou superior
- PostgreSQL 12+ (produção) ou MySQL 8.0 (alternativo)
- Banco de Dados H2 (desenvolvimento/teste)

### Frontend
- Node.js 18 ou superior
- npm (vem com Node.js)
- Angular CLI 18

## 🏗️ Instalação e Configuração

### Configuração do Backend

1. **Configuração do Banco de Dados**
   - Para desenvolvimento: O banco de dados H2 é usado automaticamente
   - Para produção: Configure o PostgreSQL em `192.168.1.105:5432`
   ```sql
   -- Criar banco de dados
   CREATE DATABASE dbcra WITH ENCODING 'UTF8';
   ```

2. **Executar a Aplicação**
   ```bash
   # Modo desenvolvimento (banco de dados H2)
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   
   # Modo produção (PostgreSQL)
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

3. **Pontos de Acesso**
   - API: http://localhost:8080/cra-api
   - Console H2 (apenas desenvolvimento): http://localhost:8080/cra-api/h2-console

### Configuração do Frontend

1. **Instalar Dependências**
   ```bash
   cd cra-frontend
   npm install
   ```

2. **Executar Servidor de Desenvolvimento**
   ```bash
   npm start
   ```
   A aplicação estará disponível em `http://localhost:4200`

3. **Build de Produção**
   ```bash
   npm run build
   ```
   Os arquivos compilados estarão no diretório `dist/`.

## 🔐 Credenciais Padrão

Após executar os scripts de configuração do banco de dados, os seguintes usuários estarão disponíveis:

| Função | Nome de Usuário | Senha | Tipo |
|------|----------|----------|------|
| Administrador | admin | admin123 | 1 |
| Advogado | advogado1 | adv123 | 2 |
| Correspondente | corresp1 | corresp123 | 3 |
| Advogado | isomina | isomina123 | 2 |

## 🔄 Integração com API

O frontend está configurado para se comunicar com o backend através de uma configuração de proxy que encaminha requisições para `http://localhost:8080`. Isso evita problemas de CORS durante o desenvolvimento.

## 📚 Documentação da API

O backend fornece uma API REST abrangente com os seguintes controladores principais:

1. **AuthController** (`/api/auth`) - Autenticação e autorização
2. **UsuarioController** (`/api/usuarios`) - Gerenciamento de usuários
3. **CorrespondenteController** (`/api/correspondentes`) - Gerenciamento de correspondentes
4. **ProcessoController** (`/api/processos`) - Gerenciamento de processos
5. **SolicitacaoController** (`/api/solicitacoes`) - Gerenciamento de solicitações
6. **UfController** (`/api/ufs`) - Estados brasileiros
7. **ComarcaController** (`/api/comarcas`) - Comarcas
8. **OrgaoController** (`/api/orgaos`) - Órgãos
9. **TipoSolicitacaoController** (`/api/tipos-solicitacao`) - Tipos de solicitação

A documentação detalhada da API está disponível em [cra-backend/docs/controllers.md](cra-backend/docs/controllers.md).

## 🏗️ Estrutura do Projeto

### Backend
```
cra-backend/
├── src/main/java/br/adv/cra/
│   ├── config/           # Classes de configuração
│   ├── controller/       # Controladores REST
│   ├── dto/              # Objetos de Transferência de Dados
│   ├── entity/           # Entidades JPA
│   ├── repository/       # Repositórios Spring Data
│   ├── security/         # Configuração de segurança e tratamento JWT
│   ├── service/          # Serviços de lógica de negócio
│   └── util/             # Classes utilitárias
├── src/main/resources/
│   ├── application*.properties  # Configurações de ambiente
│   └── data.sql                 # Dados iniciais
└── docs/                      # Documentação da API
```

### Frontend
```
cra-frontend/
├── src/app/
│   ├── core/                     # Funcionalidade principal
│   │   ├── guards/               # Guards de rotas
│   │   ├── interceptors/         # Interceptadores HTTP
│   │   └── services/             # Serviços principais
│   ├── features/                 # Módulos de funcionalidades
│   │   ├── auth/                 # Autenticação
│   │   ├── dashboard/            # Dashboard
│   │   ├── user-management/      # Gerenciamento de usuários
│   │   ├── correspondent-management/  # Gerenciamento de correspondentes
│   │   ├── process-management/   # Gerenciamento de processos
│   │   └── request-management/   # Gerenciamento de solicitações
│   ├── shared/                   # Componentes e utilitários compartilhados
│   │   ├── components/           # Componentes reutilizáveis
│   │   └── models/               # Interfaces TypeScript
│   └── app-routing.module.ts     # Roteamento principal
```

## 🧪 Testes

### Backend
```bash
# Executar testes unitários
mvn test

# Executar testes de integração
mvn verify
```

### Frontend
```bash
# Executar testes unitários
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 🚨 Problemas Comuns e Soluções

### Problemas de Conexão no Backend
- Certifique-se de que o PostgreSQL está rodando em `192.168.1.105:5432`
- Verifique as configurações de firewall para a porta 5432
- Verifique as credenciais do banco de dados em `application-prod.properties`

### Problemas de Autenticação
- Execute o script de correção de senhas se o login falhar:
  ```bash
  psql -h 192.168.1.105 -U postgres -d dbcra -f database/fix-passwords.sql
  ```

### Problemas no Frontend
- Limpe o localStorage do navegador se estiver enfrentando problemas de login
- Verifique a expiração do token JWT
- Certifique-se de que o backend está rodando e acessível

## 📄 Licença

Este projeto faz parte do sistema CRA para gestão de correspondentes legais e é um software proprietário.

## 🤝 Contribuição

1. Siga as melhores práticas do Angular e Spring Boot
2. Utilize TypeScript em modo estrito
3. Implemente tratamento adequado de erros
4. Adicione documentação apropriada
5. Teste suas alterações cuidadosamente

## 🆘 Suporte

Para problemas e dúvidas:
1. Verifique se tanto o backend quanto o frontend estão rodando
2. Verifique as permissões e funções dos usuários
3. Verifique o console do navegador e os logs da aplicação em busca de erros
4. Revise as requisições de rede nas ferramentas de desenvolvedor