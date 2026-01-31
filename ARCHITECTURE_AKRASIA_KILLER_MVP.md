# 🏗️ SYSTEM ARCHITECTURE - AKRASIA KILLER MVP
## Full-Stack Design: Frontend → Backend → Database → Infrastructure

**Data**: 31 de Janeiro de 2026
**Architect**: Aria (@architect)
**Status**: ✅ READY FOR DEVELOPMENT
**Timeline**: 8-10 semanas MVP

---

## 🎯 VISÃO ARQUITETURAL

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                     │
│  Web (React) | Mobile (React Native) | Admin Dashboard      │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY / REST LAYER                  │
│  Authentication | Rate Limiting | Request Logging           │
└────────┬────────────────────────────────────────────────────┘
         │
    ┌────┴────────────────────┬─────────────────────┐
    ▼                         ▼                     ▼
┌─────────────┐      ┌──────────────┐     ┌─────────────────┐
│ Auth Service│      │  Core Service │    │  IA Service     │
│ (JWT, MFA)  │      │ (Features)    │    │ (Claude API)    │
└─────────────┘      └──────────────┘     └─────────────────┘
    ▼                    ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│            SHARED SERVICES & UTILITIES                      │
│  Notification | Logging | Error Handling | Caching (Redis) │
└────────┬────────────────────────────────────────────────────┘
         │
    ┌────┴────────────────┬─────────────────┐
    ▼                     ▼                 ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Redis      │  │  S3 / Cloud  │
│  (Primary DB)│  │  (Cache)    │  │  (PDFs)      │
└──────────────┘  └─────────────┘  └──────────────┘
```

---

## 📊 TECH STACK DECISION

### Frontend Layer

#### Web (MVP Primary)
```
Technology: React 18 + TypeScript
State Management: Zustand (simples, não precisa Redux)
UI Library: TailwindCSS + Shadcn/UI
Routing: TanStack Router (React Router V7 alternative)
API Client: TanStack Query + Axios
Forms: React Hook Form + Zod validation
Testing: Vitest + React Testing Library
Build: Vite (rápido, moderno)

Justificativa:
✅ React: Comunidade grande, componentes reutilizáveis
✅ Zustand: State simples (não precisa complexidade Redux)
✅ TailwindCSS: Prototipagem rápida, design system
✅ Shadcn: Componentes prontos, acessíveis
✅ Vite: Build 10x mais rápido que CRA
```

#### Mobile (Phase 2)
```
Technology: React Native + Expo (para MVP iniciar web)
Target: iOS + Android
Framework: Expo (simplified, faster development)

Nota: Não incluir no MVP (apenas web)
Será Phase 2 se MVP suceder
```

---

### Backend Layer

#### Core Backend
```
Technology: Node.js 18+ com Express.js
Language: TypeScript (type safety)
Runtime: Node.js 18+ (LTS até 2025)

Framework Choice: Express (lightweight, battle-tested)
Alternatives considered:
  ❌ Nest.js (over-engineered para MVP)
  ❌ Fastify (overkill, Express suficiente)
  ✅ Express (comunidade grande, simples)

Structure: MVC + Service Layer
  routes/ → controllers/ → services/ → db models/

APIs:
  REST (primary)
  WebSocket (optional, para live updates)
```

#### Service Architecture
```
1. Auth Service
   - JWT token generation
   - MFA (TOTP via Google Authenticator)
   - Password hashing (bcrypt)
   - Session management

2. Core Service (Main Features)
   - PDF upload + storage
   - Cardápio generation
   - Grid tracking
   - Tríade/Identidade features

3. IA Service (Motor Logístico)
   - Claude API orchestration
   - OCR processing
   - Protocol transformation
   - Prompt engineering

4. Notification Service
   - Push notifications (Firebase Cloud Messaging)
   - Email (SendGrid)
   - SMS (Twilio, optional)

5. Utility Services
   - Logging (Winston)
   - Error handling (Sentry)
   - Caching (Redis)
   - File storage (S3 abstraction)
```

---

### Database Layer

#### Primary Database: PostgreSQL 14+
```
Rationale:
✅ ACID compliance (transações seguras)
✅ JSON support (armazenar dinâmico)
✅ Full-text search (future: buscar cardápios)
✅ Row-level security (RLS para LGPD)
✅ Proven at scale (Uber, Instagram, etc)

Hosting: AWS RDS PostgreSQL ou GCP Cloud SQL
  - Automated backups
  - Multi-AZ for HA
  - Point-in-time recovery

Connection Pool: pg (node-postgres) + pgBouncer
  - Max connections: 20 (development), 100 (production)
  - Connection pooling em 3 tiers (auth, app, background)
```

#### Schema Overview (High Level)

```sql
-- Users
users (id, email, password_hash, created_at, ...)

-- Authentication
sessions (user_id, token, expires_at, ...)
mfa_configs (user_id, secret, enabled, ...)

-- Profile & Identity
user_profiles (user_id, personality_traits, life_history, ...)
identity_projects (user_id, current_identity, ideal_identity, ...)

-- Nutrition & Meal Planning
pdf_uploads (user_id, filename, storage_path, processed_at, ...)
meal_plans (user_id, pdf_id or generated, meals_json, created_at, ...)
shopping_lists (meal_plan_id, ingredients_json, ...)

-- Protocol Execution
protocols (meal_plan_id, steps_json, total_time, created_at, ...)
protocol_executions (user_id, protocol_id, completed_steps, status, ...)

-- Tracking
grid_entries (user_id, date, protocol_executed, meals_followed, ...)
triad_logs (user_id, date, behavior, cognition, affect, ...)

-- IA Processing
ai_requests (user_id, type, input_tokens, output_tokens, cost, ...)
ai_cache (prompt_hash, response, expires_at, ...)
```

#### Caching Layer: Redis
```
Purpose: Speed up frequent queries
Use cases:
  - Session storage (instead of DB)
  - Grid data (pre-computed for dashboard)
  - User preferences (theme, notifications)
  - Rate limiting counters
  - API response cache (5-10 min TTL)
  - AI prompt cache (30 min TTL, save costs)

Setup: AWS ElastiCache or GCP Memorystore
  - Single node (dev), cluster mode (prod)
  - 2GB capacity (MVP), scale as needed
```

#### File Storage: AWS S3 or GCP Cloud Storage
```
Purpose: Store PDFs, meal plan images
Structure:
  s3://akrasia-killer/pdfs/{user_id}/{timestamp}.pdf
  s3://akrasia-killer/exports/{user_id}/{export_type}.json

Security:
  - Private access (no public URLs)
  - Server-side encryption (SSE-S3)
  - Versioning enabled (recovery)
  - Lifecycle policy (30 days delete old versions)

Abstraction: Cloud storage adapter (support S3, GCS, Azure)
```

---

## 🔗 API DESIGN (REST)

### Authentication Endpoints

```
POST /api/auth/signup
  Request: { email, password, consent_gdpr }
  Response: { user_id, token, refresh_token }

POST /api/auth/login
  Request: { email, password }
  Response: { token, refresh_token, requires_mfa: boolean }

POST /api/auth/mfa/verify
  Request: { user_id, totp_code }
  Response: { token, refresh_token }

POST /api/auth/refresh
  Request: { refresh_token }
  Response: { token, expires_in }

POST /api/auth/logout
  Response: { success: true }

GET /api/user/data
  Response: { user_data (JSON export) }

DELETE /api/user/data
  Request: { confirmation_token }
  Response: { success: true, deleted_at }
```

### PDF & Nutrition Endpoints

```
POST /api/nutrition/pdf/upload
  Request: multipart file (PDF)
  Response: { pdf_id, processing_status }

GET /api/nutrition/pdf/{pdf_id}/status
  Response: { status, progress%, error (if any) }

GET /api/nutrition/pdf/{pdf_id}/protocol
  Response: { protocol (structured JSON) }

GET /api/nutrition/meal-plan
  Response: { meals, ingredients, macros }

POST /api/nutrition/cardapio/generate
  Request: { objective, restrictions, preferences, cep }
  Response: { cardapio_id, meals }

PUT /api/nutrition/cardapio/{cardapio_id}
  Request: { meals (updated) }
  Response: { updated_cardapio }

GET /api/nutrition/shopping-list
  Response: { ingredients (grouped by category) }
```

### Protocol & Execution Endpoints

```
GET /api/protocol/sunday
  Response: { protocol, steps, total_duration }

POST /api/protocol/start
  Request: { protocol_id, start_time }
  Response: { execution_id, timer_data }

PATCH /api/protocol/step/{step_id}/complete
  Request: { duration_actual }
  Response: { next_step, notification_time }

GET /api/grid/current
  Response: { grid_data (66 days), streak, badges }

POST /api/grid/mark
  Request: { date, type (protocol/meal), value }
  Response: { updated_grid, badge_unlocked? }
```

### Identity & Tracking Endpoints

```
POST /api/identity/triad
  Request: { date, behavior, cognition, affect }
  Response: { triad_id, pattern_detected? }

GET /api/identity/patterns
  Response: { patterns: [{ trigger, thought, emotion, frequency }] }

POST /api/identity/origin/quiz
  Request: { personality_scores, life_history }
  Response: { insight, recommendations }

GET /api/identity/project
  Response: { current_identity, ideal_identity, habits, progress }

PUT /api/identity/project
  Request: { ideal_identity, habits }
  Response: { updated_project, goals }

GET /api/identity/progress
  Response: { phase, day, narrative, badges }
```

### Admin & Health Endpoints

```
GET /api/health
  Response: { status, dependencies: { db, redis, s3 } }

GET /api/metrics
  Response: { active_users, protocols_completed, avg_retention }

POST /api/admin/logs
  Request: { query, date_range }
  Response: { logs }
```

---

## 🔐 SECURITY ARCHITECTURE

### Authentication & Authorization

```
Token Strategy: JWT (RS256)
  - Access token: 1 hour expiration
  - Refresh token: 30 days, httpOnly cookie
  - Token signing: RS256 (asymmetric, mais seguro que HS256)

MFA: TOTP (Time-based One-Time Password)
  - QR code no app (Google Authenticator, Authy)
  - Backup codes (10x single-use codes)
  - Obrigatório para admin, opcional para users

Rate Limiting: Redis + Express rate limiter
  - Login: 5 attempts / 15 min
  - API: 100 requests / min per user
  - PDF upload: 10 / day per user
```

### Data Protection

```
Encryption in Transit:
  - TLS 1.3 (HTTPS everywhere)
  - HSTS header (force HTTPS)
  - Secure cookies (httpOnly, Secure, SameSite)

Encryption at Rest:
  - Database: PostgreSQL TDE (Transparent Data Encryption)
  - S3: Server-side encryption (AES-256)
  - Secrets: AWS Secrets Manager ou GCP Secret Manager

Secrets Management:
  - NO hardcoded secrets in code
  - Environment variables para dev
  - AWS Secrets Manager para prod
  - Rotation policy: 90 dias
```

### Input Validation & Sanitization

```
Client-side (UX): Zod validation
Server-side (Security): Joi + custom validators
  - Email: RFC 5322 regex
  - Passwords: Min 12 chars, uppercase, number, symbol
  - PDFs: Magic bytes validation (não confiar em .pdf extension)
  - Inputs: No script tags, SQL injection prevention

Database:
  - Prepared statements (parametrized queries)
  - ORM: Prisma ou TypeORM (previne SQL injection)
  - Input escaping em strings
```

---

## 📡 INFRASTRUCTURE & DEPLOYMENT

### Cloud Platform: AWS (recomendado) ou GCP

```
Rationale AWS:
✅ Pricing competitivo
✅ RDS PostgreSQL maduro
✅ S3 confiável
✅ CloudFront (CDN)
✅ CloudWatch (monitoring)
✅ Secrets Manager

Alternativa GCP:
✅ Cloud SQL PostgreSQL
✅ Cloud Storage
✅ Cloud CDN
✅ Cloud Monitoring
```

### Services Breakdown

```
┌─ Compute ─────────────────────┐
│ Node.js App: AWS ECS Fargate   │
│ - 2 containers (dev), 5+ (prod)│
│ - Auto-scaling (CPU > 70%)     │
│ - Load balancer (AWS ALB)      │
└────────────────────────────────┘

┌─ Database ────────────────────┐
│ PostgreSQL 14 (RDS)            │
│ - 2 vCPU, 4GB RAM (dev)        │
│ - 4 vCPU, 16GB RAM (prod)      │
│ - Multi-AZ (high availability) │
│ - Daily backups (30 days)      │
└────────────────────────────────┘

┌─ Cache ──────────────────────┐
│ Redis (ElastiCache)            │
│ - 2GB (dev), 5GB (prod)        │
│ - Single node (dev), cluster   │
│ - TTL policies                 │
└────────────────────────────────┘

┌─ Storage ────────────────────┐
│ S3 Bucket                      │
│ - Encrypted at rest            │
│ - Lifecycle: Delete after 90d  │
│ - CloudFront CDN (PDFs)        │
└────────────────────────────────┘

┌─ Monitoring ─────────────────┐
│ CloudWatch                     │
│ - Logs (centralized)           │
│ - Metrics (CPU, memory, etc)   │
│ - Alarms (email on errors)     │
│ - Sentry (error tracking)      │
└────────────────────────────────┘
```

### CI/CD Pipeline

```
GitHub → GitHub Actions → Test → Build → Deploy

1. Push to branch
   └─ Run tests (npm test)
   └─ Run lint (npm run lint)
   └─ Run type check (npm run typecheck)

2. Pull request
   └─ CodeRabbit review (automated)
   └─ Manual review (@dev, @qa)

3. Merge to main
   └─ Build Docker image
   └─ Push to ECR (Elastic Container Registry)
   └─ Deploy to ECS Fargate

4. Monitoring
   └─ CloudWatch logs
   └─ Health checks
   └─ Rollback if 503+ errors
```

### Docker Strategy

```
Single Dockerfile (build once, deploy anywhere)

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

Image size: ~200MB (alpine base)
Multi-stage builds para reduzir size (não necessário, alpine OK)
```

---

## 🔄 INTEGRATION PATTERNS

### Notification System

```
Event-driven (não polling)

Quando usuário executa protocolo:
  1. Backend envia evento: "protocol_completed"
  2. Notification service escuta evento
  3. Envia push notification (Firebase Cloud Messaging)
  4. Atualiza grid em tempo real (WebSocket opcional)

Tecnologia:
  - Events: Node EventEmitter (local) ou Redis Pub/Sub (distributed)
  - Push: Firebase Cloud Messaging (FCM)
  - Email: SendGrid (async job queue)
```

### IA Integration (Claude API)

```
Sync approach (não async para MVP):
  1. User upload PDF
  2. Backend chama Claude Vision API
  3. Espera resposta (timeout: 30s)
  4. Salva result em DB

Rate limiting:
  - Max 10 PDFs/day per user
  - Cache prompts (30 min TTL)
  - Fallback: Template se IA falhar

Cost control:
  - Track tokens (input + output)
  - Alert se custo > threshold
  - Batch processing (noturno) se possível
```

### WebSocket (Optional, Phase 2)

```
Para live updates (opcional, não MVP)

Use case: Grid atualiza em tempo real
  - User marca passo no protocolo
  - Todos os navegadores do user veem update instantâneo

Library: Socket.io (simpler than raw WebSocket)
Setup: Socket.io adapter com Redis (para scaling)

Não incluir no MVP (pode usar polling)
```

---

## 📈 SCALING STRATEGY

### Phase 1 (MVP, 1-10k users)
```
Single-region deployment (us-east-1)
Vertical scaling (aumentar CPU/RAM)
No caching necessário (DB suficiente)
Simple monitoring
```

### Phase 2 (10k-100k users)
```
Add Redis cache layer
Auto-scaling ECS (CPU > 70%)
RDS read replicas
CloudFront CDN
Regional deployment (future)
```

### Phase 3 (100k+ users)
```
Multi-region deployment (us + eu + asia)
Database sharding (por user_id)
Microservices breakdown
Event sourcing
Dedicated IA inference (ollama self-hosted?)
```

---

## 🧪 LOCAL DEVELOPMENT SETUP

### Docker Compose (dev environment)

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/akrasia_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_PASSWORD=dev_password
      - POSTGRES_DB=akrasia_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Environment Variables (.env.local)

```
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgres://user:pass@localhost:5432/akrasia_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev_secret_very_insecure_only_for_dev

# Claude API
CLAUDE_API_KEY=your_key_here

# AWS (local development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local_dev
AWS_SECRET_ACCESS_KEY=local_dev
S3_BUCKET=akrasia-killer-dev

# Logging
LOG_LEVEL=debug
```

---

## 🏗️ PROJECT STRUCTURE

```
akrasia-killer/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API calls (TanStack Query)
│   │   ├── store/             # Zustand state
│   │   ├── utils/             # Helpers
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/            # Express routes
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # DB models (Prisma)
│   │   ├── middleware/        # Auth, logging, etc
│   │   ├── utils/             # Helpers
│   │   ├── config/            # Configuration
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # DB schema
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docs/
│   ├── architecture.md        # This file
│   ├── api.md                 # API documentation
│   └── deployment.md          # Deployment guide
│
├── docker-compose.yml         # Local development
└── README.md
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Production (Week 9)

- [ ] All tests passing (npm test)
- [ ] Linting clean (npm run lint)
- [ ] Type checking clean (npm run typecheck)
- [ ] CodeRabbit review passed (no CRITICAL/HIGH)
- [ ] Security audit (OWASP Top 10)
- [ ] Performance testing (load test 1000 concurrent)
- [ ] Database backups tested
- [ ] Secrets in Secrets Manager
- [ ] CloudWatch monitoring configured
- [ ] Disaster recovery plan documented

### Production (Week 10)

- [ ] Deploy to staging environment
- [ ] Smoke tests on staging
- [ ] Load testing on staging
- [ ] Deploy to production
- [ ] Health checks passing
- [ ] Real-time monitoring active
- [ ] Team on-call scheduled
- [ ] Rollback plan ready

---

## 📊 ARCHITECTURE DECISION RECORD (ADR)

### ADR-001: React + Express instead of Next.js

**Status**: ACCEPTED

**Context**:
- MVP needs fast iteration
- Full-stack monolith fine for now

**Decision**:
- Separate React frontend (Vite)
- Express backend (simple, proven)

**Rationale**:
- Clear separation of concerns
- Independent scaling (frontend is static, backend is API)
- Easier for @dev to work on (split tasks)

**Consequences**:
- No server-side rendering (OK for MVP)
- Two deployments (frontend + backend)
- CORS configuration needed

---

### ADR-002: PostgreSQL instead of MongoDB

**Status**: ACCEPTED

**Context**:
- Need ACID compliance for transactions
- LGPD compliance requires encryption

**Decision**:
- PostgreSQL 14 with RDS

**Rationale**:
- ACID guarantees (transactions safe)
- JSON support (flexible schema)
- RLS (Row-Level Security for LGPD)
- Proven at scale

**Consequences**:
- Schema migrations required
- Relational modeling (better for this domain)

---

### ADR-003: Redis for caching, not session store

**Status**: ACCEPTED

**Context**:
- JWT tokens don't need session store
- But grid data needs fast reads

**Decision**:
- JWT in httpOnly cookies (no session store)
- Redis only for caching + rate limiting

**Rationale**:
- Stateless API (easier to scale)
- Fast cache for grid (< 100ms)
- Rate limiting (memory efficient)

**Consequences**:
- Token revocation harder (use blocklist if needed)
- Redis failure doesn't break auth (graceful fallback)

---

## ✅ ARCHITECTURE VALIDATION

### Against PRD Requirements

| Requisito | Covered | How |
|-----------|---------|-----|
| PDF upload | ✅ | S3 + Claude Vision API |
| Motor Logístico | ✅ | Claude API integration |
| Cardápio generation | ✅ | Claude API + DB caching |
| 4 Identity features | ✅ | DB models + API endpoints |
| Grid gamificado | ✅ | Grid tracking + Redis cache |
| Timer + Notif | ✅ | Backend + Firebase FCM |
| 66-day support | ✅ | Timeline logic in service |
| LGPD compliance | ✅ | Encryption + RLS + deletion |
| < 120 min protocol | ✅ | Frontend timer logic |
| Geolocalização | ✅ | CEP parsing + Claude context |

---

## 🎯 SUCCESS CRITERIA

| Métrica | Target | Medida |
|---------|--------|--------|
| **Time to Interactive** | < 3s | Lighthouse audit |
| **API Response** | < 200ms | CloudWatch metrics |
| **Database Query** | < 50ms | RDS metrics |
| **Uptime** | 99.5% | CloudWatch alarms |
| **OCR Accuracy** | 95%+ | QA testing |
| **Cost/User** | < $0.50/month | AWS billing |

---

**System Architecture v1.0**
**Akrasia Killer MVP**
**31 de Janeiro de 2026 - Aria (@architect)**
