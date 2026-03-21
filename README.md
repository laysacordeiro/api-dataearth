<h1 align="center">🌿 API DataEarth — Sistema de Gerenciamento Agroecológico</h1>

<p align="center">
  Plataforma full-stack para catalogação e monitoramento de espécies, parcelas e unidades de conservação da biodiversidade brasileira.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java 17"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.7-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white" alt="Flyway"/>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status"/>
</p>

---

## 📑 Índice

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Stack Tecnológica e Arquitetura](#-stack-tecnológica-e-arquitetura)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Como Começar](#-como-começar)
6. [Uso e Endpoints da API](#-uso-e-endpoints-da-api)
7. [Contribuindo](#-contribuindo)
8. [Licença](#-licença)

---

## 🌍 Visão Geral

### 🎯 Apresentação

A **API DataEarth** é um sistema de gerenciamento agroecológico desenvolvido para apoiar a pesquisa científica e a preservação da biodiversidade. Trata-se de uma plataforma robusta, segura e escalável que conecta pesquisadores, administradores e visitantes em torno de um objetivo comum: **o registro sistemático e a análise de espécies botânicas em parcelas de conservação**.

### 🔍 O Problema

A catalogação da biodiversidade em campo gera volumes expressivos de dados heterogêneos — nomes científicos, dados taxonômicos, coordenadas geográficas, informações climáticas e registros de tombamento — que frequentemente permanecem dispersos em planilhas isoladas, dificultando análises integradas, auditorias científicas e o compartilhamento de conhecimento entre instituições.

### 💡 A Solução

A plataforma DataEarth centraliza esse ecossistema de dados em uma API RESTful estruturada, com autenticação segura via JWT, controle de acesso baseado em papéis (RBAC), e um frontend moderno em Angular que oferece interfaces intuitivas para diferentes perfis de usuário. O sistema contempla desde o registro de **espécies com taxonomia completa** até o mapeamento de **parcelas georreferenciadas** com dados de localidade, clima e ambiente.

### 🏛️ Arquitetura Geral

O sistema adota uma arquitetura **cliente-servidor desacoplada**, onde o backend expõe uma API RESTful consumida pelo frontend Angular. A comunicação em tempo real é habilitada via **WebSocket**, e as notificações administrativas são enviadas por **e-mail** através do módulo Spring Mail.

```
[Usuário/Navegador]
       │
       ▼
[Frontend Angular 19]  ──── HTTP/REST ────▶ [Backend Spring Boot 3.5.7]
   Angular Material                               │          │
   PrimeNG                                   [JPA/Hibernate] [Spring Security]
   Supabase Client                                │          │
                                              [MySQL 8.0]  [JWT + RBAC]
                                                           [Flyway Migrations]
```

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação e Autorização** — Registro de usuários com fluxo de aprovação administrativa, login com JWT e controle de acesso por papéis (`ADMIN`, `PESQUISADOR`, `VISITANTE`)
- 🌿 **Gestão de Espécies** — Cadastro, edição, consulta e exclusão de espécies com nome vulgar, nome científico, autor, ano de publicação, descrição e vínculo taxonômico
- 🔬 **Taxonomia Hierárquica** — Estruturação taxonômica completa vinculada a cada espécie cadastrada
- 📦 **Controle de Tombos** — Registro de exemplares tombados associados a espécies específicas
- 🗺️ **Parcelas Georreferenciadas** — Gerenciamento de parcelas com dados de proprietário, uso da terra, data do evento e vínculos a entidades de localidade, clima e ambiente
- 🌤️ **Dados Climáticos e Ambientais** — Associação de condições climáticas e características de ambiente (tipo de vegetação, preparo, bioma) a cada parcela
- 📍 **Localidades** — Registro de coordenadas geográficas e metadados de localização vinculados às parcelas
- 🪨 **Monolitos** — Catalogação de estruturas geológicas associadas às parcelas de estudo
- 📋 **Painel Administrativo de Solicitações** — Interface exclusiva para admins gerenciarem pedidos de acesso pendentes (aceitar/negar) com notificação por e-mail
- 📡 **Comunicação em Tempo Real** — Suporte a WebSocket para atualizações em tempo real no painel
- 🌐 **Frontend Responsivo** — Interface web moderna com Angular Material e PrimeNG

---

## 🛠️ Stack Tecnológica e Arquitetura

### Backend

| Tecnologia | Finalidade | Por que foi escolhida |
|---|---|---|
| **Java 17 (LTS)** | Linguagem principal do backend | Versão LTS com records, pattern matching e performance otimizada |
| **Spring Boot 3.5.7** | Framework de aplicação | Configuração por convenção, ecossistema maduro e suporte nativo ao Jakarta EE |
| **Spring Security** | Autenticação e autorização | Integração nativa com JWT e suporte a RBAC com `@PreAuthorize` |
| **Spring Data JPA** | ORM e acesso a dados | Abstração de repositórios com suporte total ao Hibernate |
| **JJWT 0.11.5** | Geração e validação de tokens JWT | Biblioteca dedicada, compacta e bem documentada para Java |
| **Flyway** | Versionamento e migração do banco | Controle rigoroso da evolução do schema com histórico auditável |
| **MySQL 8.0** | Banco de dados relacional | Suporte a constraints complexas, ampla adoção e compatibilidade com JPA |
| **Spring WebSocket** | Comunicação em tempo real | Integração nativa com Spring para notificações bidireciais |
| **Spring Mail** | Envio de e-mails transacionais | Abstração elegante sobre JavaMail para notificações automáticas |
| **Spring Actuator** | Monitoramento e health checks | Endpoints prontos para observabilidade da aplicação |
| **Lombok** | Redução de boilerplate | Geração automática de getters, setters, construtores via anotações |
| **Jackson Databind** | Serialização/Desserialização JSON | Padrão do ecossistema Spring para mapeamento de objetos JSON |
| **Bean Validation** | Validação de dados de entrada | Validações declarativas com anotações nos DTOs e entidades |

### Frontend

| Tecnologia | Finalidade | Por que foi escolhida |
|---|---|---|
| **Angular 19** | Framework SPA principal | Arquitetura baseada em componentes, DI nativo e suporte a SSR |
| **Angular Material 19** | Design system e componentes UI | Componentes acessíveis e responsivos seguindo o Material Design 3 |
| **PrimeNG 19** | Componentes avançados de UI | Conjunto rico de tabelas, diálogos e gráficos de alta qualidade |
| **Supabase JS 2** | Client para armazenamento e auth adicional | Integração simplificada com backend-as-a-service para assets e mídia |
| **RxJS 7.8** | Programação reativa e assíncrona | Manipulação elegante de fluxos de dados e eventos HTTP |
| **TypeScript 5.7** | Superset tipado do JavaScript | Tipagem estática que previne erros em tempo de desenvolvimento |
| **Angular Router** | Roteamento client-side e guarda de rotas | `AuthGuard` para proteção de rotas privadas sem lógica manual |
| **Karma + Jasmine** | Testes unitários do frontend | Stack padrão do Angular CLI para testes de componentes |

### Padrões de Arquitetura

- **API RESTful** com verbos HTTP semânticos e retornos padronizados via `ResponseEntity`
- **Camadas desacopladas**: `Controller → Service → Repository → Entity` (separação clara de responsabilidades)
- **RBAC (Role-Based Access Control)** com anotações `@PreAuthorize` e filtros JWT por requisição
- **Database Migrations as Code** com Flyway (9 versões de migration rastreadas)
- **DTO Pattern** para desacoplamento entre o modelo de domínio e a API pública
- **Guard Pattern** no frontend com `AuthGuard` para proteção declarativa de rotas
- **Interceptor HTTP** para injeção automática do token JWT em todas as requisições protegidas

---

## 📁 Estrutura do Projeto

```
📁 api-dataearth/
├── 📁 backend/                          → Módulo Spring Boot
│   ├── 📄 pom.xml                       → Dependências Maven e configurações de build
│   ├── 📄 .env                          → Variáveis de ambiente (não versionado)
│   └── 📁 src/main/
│       ├── 📁 java/com/projeto/agroecologia/
│       │   ├── 📄 AgroecologiaApplication.java   → Ponto de entrada da aplicação
│       │   └── 📁 domain/
│       │       ├── 📁 config/           → Configurações de segurança, CORS, WebSocket
│       │       ├── 📁 controller/       → Controladores REST
│       │       │   ├── 📄 AuthController.java
│       │       │   ├── 📄 EspecieController.java
│       │       │   ├── 📄 TaxonomiaController.java
│       │       │   ├── 📄 MonolitoController.java
│       │       │   ├── 📄 ParcelaController.java
│       │       │   ├── 📄 LocalidadeController.java
│       │       │   ├── 📄 ClimaController.java
│       │       │   ├── 📄 EnvironmentController.java
│       │       │   └── 📄 SolicitacaoController.java
│       │       ├── 📁 dto/              → Objetos de transferência de dados
│       │       ├── 📁 enume/            → Enumerações do domínio
│       │       ├── 📁 model/            → Entidades JPA
│       │       │   ├── 📄 User.java     → Entidade de usuário com papéis
│       │       │   ├── 📄 Role.java     → Papel/perfil de acesso
│       │       │   ├── 📄 Especie.java  → Espécie botânica
│       │       │   ├── 📄 Taxonomia.java
│       │       │   ├── 📄 Tombo.java    → Exemplar tombado
│       │       │   ├── 📄 Monolito.java → Estrutura geológica
│       │       │   ├── 📄 Parcela.java  → Parcela georreferenciada
│       │       │   ├── 📄 Localidade.java
│       │       │   ├── 📄 Clima.java
│       │       │   ├── 📄 Environment.java
│       │       │   └── 📄 Solicitacao.java
│       │       ├── 📁 repository/       → Interfaces Spring Data JPA
│       │       ├── 📁 service/          → Regras de negócio
│       │       └── 📁 utils/            → Utilitários (geração JWT, etc.)
│       └── 📁 resources/
│           ├── 📄 application.properties → Configurações da aplicação
│           └── 📁 db/migration/          → Scripts Flyway
│               ├── 📄 V001__tabela_usuario.sql
│               ├── 📄 V002__tabela_taxonomia.sql
│               ├── 📄 V003__tabela_especies.sql
│               ├── 📄 V004__tabelas_monolito.sql
│               ├── 📄 V005__tabela_tombo.sql
│               ├── 📄 V006__tabela_solicitacao.sql
│               ├── 📄 V007__remove_email_column.sql
│               ├── 📄 V008__tabelas_parcela_localidade_clima.sql
│               └── 📄 V009__addcolumntomonolith.sql
│
└── 📁 frontend/                          → Módulo Angular 19
    ├── 📄 package.json                   → Dependências npm
    ├── 📄 angular.json                   → Configuração do Angular CLI
    ├── 📄 tsconfig.json                  → Configuração TypeScript
    └── 📁 src/
        ├── 📄 main.ts                    → Bootstrap da aplicação
        ├── 📄 styles.scss                → Estilos globais
        └── 📁 app/
            ├── 📄 app.routes.ts          → Definição de rotas
            ├── 📄 auth.guard.ts          → Guarda de autenticação
            ├── 📁 pages/                 → Páginas da aplicação
            │   ├── 📁 login/             → Tela de login
            │   ├── 📁 signup/            → Tela de cadastro
            │   ├── 📁 mainpage/          → Dashboard principal
            │   ├── 📁 especies/          → Gerenciamento de espécies
            │   ├── 📁 monolito/          → Gerenciamento de monolitos
            │   ├── 📁 visitante/         → Área do visitante
            │   └── 📁 admin-solicitacoes/→ Painel administrativo
            ├── 📁 components/            → Componentes reutilizáveis
            ├── 📁 services/              → Serviços HTTP Angular
            ├── 📁 models/                → Interfaces TypeScript
            ├── 📁 interceptor/           → Interceptor JWT
            └── 📁 types/                 → Tipos customizados
```

---

## 🚀 Como Começar

### Pré-requisitos

Certifique-se de possuir as seguintes ferramentas instaladas:

| Ferramenta | Versão mínima | Link |
|---|---|---|
| **JDK** | 17 | [Adoptium](https://adoptium.net/) |
| **Apache Maven** | 3.9+ | [maven.apache.org](https://maven.apache.org/) |
| **Node.js** | 20 LTS | [nodejs.org](https://nodejs.org/) |
| **Angular CLI** | 19 | `npm install -g @angular/cli` |
| **MySQL** | 8.0 | [mysql.com](https://www.mysql.com/) |

### Instalação e Execução

#### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/api-dataearth.git
cd api-dataearth
```

#### 2. Configure o banco de dados

Crie o schema no MySQL e configure as variáveis de ambiente:

```bash
# No MySQL
CREATE DATABASE agroecologia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Crie o arquivo `backend/.env` com base nas variáveis necessárias:

```env
DB_URL=jdbc:mysql://localhost:3306/agroecologia
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_jwt
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_de_app
ADMIN_EMAIL=admin@dataearth.com
```

> **⚠️ Atenção**: Jamais versione o arquivo `.env`. Ele já está incluído no `.gitignore`.

#### 3. Inicie o Backend

```bash
cd backend
./mvnw spring-boot:run
```

O Flyway executará automaticamente as 9 migrations e criará todas as tabelas. A API estará disponível em `http://localhost:8080`.

#### 4. Inicie o Frontend

```bash
cd frontend
npm install
ng serve
```

O frontend estará disponível em `http://localhost:4200`.

---

## 📡 Uso e Endpoints da API

A API escuta por padrão em `http://localhost:8080`. Todos os endpoints protegidos requerem o header:

```
Authorization: Bearer <seu_token_jwt>
```

### 🔐 Autenticação — `/auth`

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Autentica o usuário e retorna o token JWT |
| `POST` | `/auth/register` | Público | Envia solicitação de acesso (aguarda aprovação) |
| `GET` | `/auth/usuarios` | Autenticado | Lista todos os usuários cadastrados |

**Exemplo de Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -d "username=pesquisador@email.com&password=senha123"
# Resposta: { "token": "eyJhbGci..." }
```

### 🌿 Espécies — `/especies`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/especies` | Lista todas as espécies |
| `GET` | `/especies/{id}` | Busca espécie por ID |
| `POST` | `/especies/adicionar` | Cadastra nova espécie |
| `PUT` | `/especies/editar/{id}` | Atualiza espécie existente |
| `DELETE` | `/especies/deletar/{id}` | Remove espécie |

### 🗺️ Parcelas — `/parcelas`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/parcelas` | Lista todas as parcelas |
| `GET` | `/parcelas/{id}` | Busca parcela por ID |
| `POST` | `/parcelas` | Cadastra nova parcela |
| `PUT` | `/parcelas/{id}` | Atualiza parcela (proprietário, uso da terra, localidade, clima, ambiente) |
| `DELETE` | `/parcelas/{id}` | Remove parcela |

### 📋 Administração — `/admin/solicitacoes` *(somente ADMIN)*

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/admin/solicitacoes` | Lista solicitações de acesso pendentes |
| `PUT` | `/admin/solicitacoes/{id}/aceitar` | Aceita solicitação e ativa usuário |
| `PUT` | `/admin/solicitacoes/{id}/negar` | Rejeita solicitação de acesso |

### Demais Recursos

| Recurso | Base Path |
|---|---|
| Taxonomias | `/taxonomias` |
| Monolitos | `/monolitos` |
| Localidades | `/localidades` |
| Climas | `/climas` |
| Ambientes | `/environments` |

### 🖥️ Navegação no Frontend

| Rota | Acesso | Descrição |
|---|---|---|
| `/login` | Público | Tela de login |
| `/signup` | Público | Formulário de solicitação de cadastro |
| `/mainpage` | Autenticado | Dashboard principal |
| `/especies` | Autenticado | Gerenciamento de espécies |
| `/monolitos` | Autenticado | Gerenciamento de monolitos |
| `/visitante` | Autenticado | Área de visualização para visitantes |
| `/admin/solicitacoes` | Admin | Painel de aprovação de usuários |

---
