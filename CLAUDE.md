# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Akrasia Killer MVP** - A full-stack application for personal sovereignty and habit formation using AI-powered analysis.

**Status:** Sprint 1 Complete (v0.1.0) - Production Ready
- 21/21 story points implemented
- 34/34 tests passing (100% business logic coverage)
- QA Approved (8.8/10 score)
- GitHub repository: https://github.com/Araga-netizen/akrasia-killer-mvp

## Essential Commands

### Development
```bash
npm run dev          # Start backend in watch mode (port 3000)
npm test             # Run all tests (34 tests)
npm test -- --run    # Run tests once (non-watch mode)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled backend (Node.js)
npm run lint         # Run linting (currently echo placeholder)
```

### Docker
```bash
docker-compose up -d     # Start local development (app + PostgreSQL + Redis)
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

### Git & Repository
```bash
# Push operations delegated to @devops (Gage) agent
# Story completion requires QA approval before push
git status           # Check working tree
git log --oneline    # View commit history
npm run build        # TypeScript compilation check
npm test             # All quality gates must pass
```

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js 20.x (LTS)
- **Framework:** Express.js 4.18.2
- **Language:** TypeScript 5.2 (strict mode)
- **Testing:** Vitest with 100% business logic coverage
- **Security:** Helmet, CORS, rate limiting, bcryptjs hashing, AES-256 encryption

### Directory Structure

```
src/backend/
├── index.ts                    # Express app setup, middleware chain
├── middleware/
│   ├── auth.ts                # JWT validation, token generation
│   └── errorHandler.ts        # Centralized error handling
├── routes/
│   ├── auth.ts               # POST /auth/signup, /auth/login
│   ├── consent.ts            # POST /consent/agree, GET /consent/status
│   ├── onboarding.ts         # POST /onboarding/select-path, session management
│   └── nutrition.ts          # POST /nutrition/pdf/upload, PDF handling
├── services/
│   ├── authService.ts        # User signup/login, password hashing, rate limiting
│   ├── consentService.ts     # LGPD consent management (3-tier system)
│   ├── onboardingService.ts  # Session creation/completion, path selection
│   └── pdfService.ts         # PDF validation, AES-256 encryption, S3 upload
├── types/
│   └── index.ts              # TypeScript interfaces (100+ types defined)
└── config/
    └── monitoring.ts         # Health checks, deployment checklist

tests/unit/
├── authService.test.ts       # 10 tests: signup, login, rate limiting
├── consentService.test.ts    # 6 tests: consent recording, revocation
├── onboardingService.test.ts # 10 tests: session management, path selection
└── pdfService.test.ts        # 8 tests: validation, encryption, S3 integration
```

### Key Architectural Patterns

**Service Layer Pattern**
- Routes → Services → In-memory databases (Phase 1)
- Each service has clear responsibility (Auth, PDF, Consent, Onboarding)
- Services mock databases for MVP speed (PostgreSQL migration planned Phase 2)

**Type Safety**
- Full TypeScript strict mode (0 type violations)
- 100+ interfaces defining Request/Response shapes
- AuthenticatedRequest extends Express Request for middleware integration

**Middleware Chain**
```
helmet (security headers)
  → cors (CORS configuration)
    → rate-limit (100 req/15min per IP)
      → json/urlencoded (50MB limit)
        → routes
          → errorHandler (catches all errors)
```

**Error Handling**
- Custom AppError class with statusCode + message
- errorHandler middleware converts errors to consistent JSON responses
- asyncHandler wrapper for route handlers catches Promise rejections

### Authentication & Security

**JWT Implementation (auth.ts)**
- Bearer token validation on protected routes
- bcryptjs hashing with 10 rounds
- Rate limiting: 5 failed attempts → 15-minute account lockout
- Token expiration: 1 hour (configurable via JWT_EXPIRES_IN)
- ⚠️ Phase 2: Migrate JWT_SECRET to AWS Secrets Manager

**Data Protection**
- PDF files encrypted with AES-256-CBC before S3 storage
- MIME type + magic bytes validation on upload
- Email validation with regex pattern enforcement
- Input validation on all critical endpoints
- Helmet security headers enabled

**LGPD Compliance (consentService.ts)**
- Three-tier consent system: Privacy Policy, Data Processing, AI Processing
- Versioning for audit trails
- Timestamp-based revocation tracking
- User-scoped isolation prevents cross-user access

## Testing Strategy

### Running Tests

**All tests:**
```bash
npm test
```

**Specific test file:**
```bash
npm test -- authService.test.ts
npm test -- pdfService.test.ts
```

**Specific test case:**
```bash
npm test -- authService.test.ts -t "should reject password"
```

**Watch mode:**
```bash
npm run test:watch
```

### Test Coverage

| Service | Tests | Focus |
|---------|-------|-------|
| authService | 10 | signup validation, login, rate limiting, lockout |
| pdfService | 8 | file validation, size/MIME/magic bytes checks |
| consentService | 6 | consent recording, revocation, validation |
| onboardingService | 10 | session CRUD, path selection, user isolation |

**Key Pattern:** BeforeEach runs resetStores() to prevent state pollution between tests.

## Type System

All business entities defined in `src/backend/types/index.ts`:

```typescript
interface User { id, email, passwordHash, createdAt, updatedAt }
interface JWTPayload { userId, email, iat?, exp? }
interface PDFMetadata { id, user_id, file_name, s3_key, processing_status... }
interface AuthenticatedRequest extends Request { user? { userId, email } }
```

Routes import these types for full type safety (no `any` except 1 justified case in JWT options).

## Environment Variables

Required for local development (see `.env.example`):

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key (Phase 2: use AWS Secrets Manager)
JWT_EXPIRES_IN=1h
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:pass@localhost/dbname (Phase 2)
REDIS_URL=redis://localhost:6379 (Phase 2)
```

## Development Workflow

### Before Committing Code

1. **Run tests:** `npm test` (must be 34/34 passing)
2. **Compile TypeScript:** `npm run build` (0 errors)
3. **Check linting:** `npm run lint`

### Story Completion

1. Implement in service layer (e.g., authService.ts)
2. Add corresponding route (e.g., routes/auth.ts)
3. Write unit tests (tests/unit/authService.test.ts)
4. Ensure all acceptance criteria met
5. Get QA approval (@qa agent)
6. Push via @devops agent (exclusive git push authority)

### Adding a New Feature

1. **Define types** → `src/backend/types/index.ts`
2. **Create service** → `src/backend/services/newService.ts` with business logic
3. **Create route** → `src/backend/routes/newRoute.ts` with endpoint
4. **Add middleware** → If cross-cutting concern (auth, validation)
5. **Write tests** → `tests/unit/newService.test.ts`
6. **Register route** → Add `app.use('/api/path', newRoutes)` in index.ts

## Database & Persistence

**Current (MVP - Phase 1):**
- In-memory Map-based storage for speed
- Each service maintains own mock database
- No persistence across restarts (acceptable for MVP)

**Phase 2 Roadmap:**
- PostgreSQL with Prisma ORM
- Database schema migration from in-memory models
- Connection pooling (pgBouncer or Prisma client)
- Redis for caching and session management

## Deployment

### Local Docker
```bash
docker-compose up -d
# Services available:
# - App: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### GitHub Actions CI/CD
Workflows in `.github/workflows/ci-cd.yml`:
1. **Test & Build** - npm audit, TypeScript check, tests, Docker build
2. **Code Quality** - ESLint, CodeRabbit security scanning
3. **Security** - Trivy vulnerability scan, npm audit
4. **Deploy** - Smoke tests (Phase 2: AWS ECS Fargate)

### Release Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog auto-generated from commits
- GitHub releases with detailed notes
- Current version: v0.1.0 (January 31, 2026)

## Sprint 1 Implementation Status

**Completed (21/21 points):**
- E1-S1: PDF Upload & Storage (AES-256 encryption, S3 integration)
- E5-S1: Authentication (JWT, bcryptjs, rate limiting, account lockout)
- E5-S2: LGPD Consent (3-tier system, audit trail)
- E5-S3: Onboarding Flow (path selection: PDF vs Quiz)
- E7-S6: Deployment & Monitoring (Docker, CI/CD, health checks)

**Quality Gate:** PASS ✅ (8.8/10 score, 0 CRITICAL issues)

## Common Development Tasks

### Add Validation to a Service
- Use Zod schemas (imported from `zod`)
- Throw AppError(400, message) for validation failures
- Error handler middleware catches and formats response

### Encrypt Sensitive Data
- Use `pdfService.encryptPDF()` pattern
- AES-256-CBC with crypto module
- Store encrypted key in environment variables

### Implement Rate Limiting
- Express-rate-limit middleware already configured globally
- authService tracks failed attempts per email → 15min lockout

### Write a New Test
```typescript
describe('NewService', () => {
  beforeEach(() => {
    resetStores(); // Clear mock databases
  });

  it('should do something', () => {
    const result = newService.doSomething();
    expect(result).toBe(expected);
  });
});
```

## Important Notes for Future Development

1. **No force-push to main/master** - Only @devops agent authorized for git push
2. **QA approval before push** - All stories require quality gate decision
3. **Test every story** - Unit tests required for business logic
4. **Keep services focused** - Single responsibility per service
5. **Type everything** - No `any` types except justified cases
6. **Validate at boundaries** - User input, external APIs
7. **Phase 2 migration** - In-memory to PostgreSQL transformation planned
8. **Security hardening** - JWT secret to AWS Secrets Manager before production scale

## Related Documentation

- **Architecture:** `ARCHITECTURE_AKRASIA_KILLER_MVP.md` (full system design)
- **Deployment:** `DEPLOYMENT_GUIDE.md` (Docker, AWS, monitoring)
- **QA Reports:** `docs/qa/` (quality gate decisions, test coverage)
- **Epics/Stories:** `EPICS_STORIES_BREAKDOWN.md` (feature requirements)
- **PRD:** `PRD_AKRASIA_KILLER_MVP.md` (product requirements)
