# 🚀 Akrasia Killer MVP - Deployment Guide

## Local Development with Docker Compose

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ installed locally

### Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Services
- **App**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (user: akrasia, password: password)
- **Redis**: localhost:6379

### Environment Variables

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env

# Edit .env with your values
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://akrasia:password@postgres:5432/akrasia_dev
REDIS_URL=redis://redis:6379
```

---

## GitHub Actions CI/CD Pipeline

### Pipeline Stages

1. **Test & Build**
   - Install dependencies
   - Run linting
   - Type checking
   - Unit tests
   - Build Docker image
   - Push to container registry

2. **Code Quality**
   - ESLint check
   - TypeScript validation
   - CodeRabbit review (PR only)

3. **Security**
   - npm audit
   - Trivy vulnerability scan
   - SAST analysis

4. **Deploy** (main branch only)
   - Deploy to staging
   - Run smoke tests
   - Notify team

### Triggering Pipeline

Pipeline runs automatically on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

View workflow: `.github/workflows/ci-cd.yml`

---

## AWS Deployment (Phase 2 Ready)

### Architecture
```
GitHub → ECR (Docker Registry)
  ↓
GitHub Actions → ECS Fargate
  ↓
ALB → ECS Task
  ↓
RDS PostgreSQL + ElastiCache Redis
```

### ECS Fargate Setup

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name akrasia-killer
```

2. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name akrasia-prod
```

3. **Create Task Definition**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

4. **Create Service**
```bash
aws ecs create-service --cluster akrasia-prod --service-name api --task-definition akrasia-api:1 --desired-count 2
```

### RDS Database Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier akrasia-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username akrasia \
  --allocated-storage 20
```

### ElastiCache Redis Setup

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id akrasia-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

---

## Monitoring & Alerts

### CloudWatch Metrics
- API response time
- Error rate
- Database query time
- Memory usage
- CPU usage

### Sentry Error Tracking
1. Create Sentry project
2. Set `SENTRY_DSN` in environment
3. Enable Sentry middleware:

```typescript
// In production
if (process.env.SENTRY_ENABLED === "true") {
  app.use(Sentry.Handlers.requestHandler());
}
```

### Health Check Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T22:00:00Z",
  "uptime": 3600,
  "services": {
    "database": "ok",
    "redis": "ok",
    "s3": "ok"
  }
}
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scan passed
- [ ] Environment variables configured
- [ ] Backup database created

### During Deployment
- [ ] Docker image built successfully
- [ ] ECS task definition updated
- [ ] New tasks are starting
- [ ] Load balancer traffic shifting

### Post-Deployment
- [ ] Health checks passing
- [ ] Smoke tests successful
- [ ] Metrics visible in CloudWatch
- [ ] Error rate normal
- [ ] Team notified

### Rollback Plan
- [ ] Previous ECS task definition available
- [ ] Rollback procedure documented
- [ ] Quick rollback command tested

---

## Rollback Procedure

If deployment issues occur:

```bash
# View task definition history
aws ecs describe-task-definition --task-definition akrasia-api

# Update service to use previous version
aws ecs update-service \
  --cluster akrasia-prod \
  --service api \
  --task-definition akrasia-api:N  # Previous version number

# Monitor rollback
aws ecs describe-services --cluster akrasia-prod --services api
```

---

## Performance Optimization

### Database Optimization
- Enable slow query logging
- Create indexes on frequently queried columns
- Use connection pooling

### Redis Caching
- Cache API responses (5-10 min TTL)
- Cache user authentication tokens
- Cache frequently accessed PDFs

### CDN Setup (Phase 2)
- Use CloudFront for static assets
- Cache HTML/CSS/JS files
- Set appropriate cache headers

---

## Troubleshooting

### Docker Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check service logs
docker-compose logs app
```

### Database Connection
```bash
# Test PostgreSQL connection
psql postgresql://akrasia:password@localhost:5432/akrasia_dev

# Check Redis connection
redis-cli -h localhost PING
```

### Deployment Failures
1. Check GitHub Actions logs
2. Review CloudWatch logs
3. Verify environment variables
4. Check security groups/firewall rules

---

## Security Best Practices

- [ ] Always use HTTPS in production
- [ ] Rotate secrets regularly
- [ ] Enable VPC security groups
- [ ] Enable RDS encryption
- [ ] Enable S3 encryption
- [ ] Use WAF for DDoS protection
- [ ] Enable CloudTrail logging
- [ ] Regular security audits

---

**Status**: 🟢 **MVP DEPLOYMENT READY**

**Phase 2**: ECS, RDS, ElastiCache, CloudFront setup

Last Updated: Jan 31, 2026
