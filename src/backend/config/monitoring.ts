/**
 * Monitoring Configuration (Sentry, CloudWatch, Health Checks)
 */

interface MonitoringConfig {
  sentryDSN?: string;
  sentryEnabled: boolean;
  cloudWatchEnabled: boolean;
  healthCheckInterval: number;
  metricsEnabled: boolean;
}

export const monitoringConfig: MonitoringConfig = {
  sentryDSN: process.env.SENTRY_DSN,
  sentryEnabled: process.env.SENTRY_ENABLED === "true" || false,
  cloudWatchEnabled: process.env.CLOUDWATCH_ENABLED === "true" || false,
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || "30000"), // 30s
  metricsEnabled: process.env.METRICS_ENABLED === "true" || true,
};

/**
 * Health Check Response Structure
 */
export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database?: "ok" | "error";
    redis?: "ok" | "error";
    s3?: "ok" | "error";
  };
  metrics?: {
    memoryUsage: number;
    cpuUsage: number;
    requestCount: number;
    errorCount: number;
  };
}

/**
 * Generate Health Check Response
 */
export const generateHealthCheck = (): HealthCheckResponse => {
  const memUsage = process.memoryUsage();

  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "ok", // TODO: Implement actual check
      redis: "ok",    // TODO: Implement actual check
      s3: "ok",       // TODO: Implement actual check
    },
    metrics: monitoringConfig.metricsEnabled ? {
      memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024),
      cpuUsage: process.cpuUsage().user,
      requestCount: 0, // TODO: Track requests
      errorCount: 0,   // TODO: Track errors
    } : undefined,
  };
};

/**
 * Deployment Checklist
 */
export const deploymentChecklist = {
  preDeployment: [
    { item: "All tests passing", completed: false },
    { item: "Code review approved", completed: false },
    { item: "Security scan passed", completed: false },
    { item: "Environment variables configured", completed: false },
  ],
  deployment: [
    { item: "Docker image built and pushed", completed: false },
    { item: "ECS task definition updated", completed: false },
    { item: "Load balancer configured", completed: false },
    { item: "Monitoring alerts enabled", completed: false },
  ],
  postDeployment: [
    { item: "Health check passing", completed: false },
    { item: "Smoke tests passing", completed: false },
    { item: "Metrics visible in CloudWatch", completed: false },
    { item: "Logs flowing to CloudWatch", completed: false },
  ],
  rollback: [
    { item: "Previous version available", completed: false },
    { item: "Rollback procedure documented", completed: false },
    { item: "Team notified", completed: false },
  ],
};

export default monitoringConfig;
