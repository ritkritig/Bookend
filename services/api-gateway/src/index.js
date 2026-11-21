const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.GATEWAY_PORT || process.env.PORT || 4000;

// Upstream service targets
const SERVICES = {
  identity: process.env.IDENTITY_SERVICE_URL || 'http://localhost:4001',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:4002',
  social: process.env.SOCIAL_SERVICE_URL || 'http://localhost:4003',
  recommendation: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:4004',
  engagement: process.env.ENGAGEMENT_SERVICE_URL || 'http://localhost:4005',
};

// CORS setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
}));

// Request ID and correlation tracing middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${uuidv4().substring(0, 8)}`;
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[GATEWAY] [${requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Gateway Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    routingTargets: SERVICES
  });
});

// Consolidated Microservice Health Aggregator
app.get('/api/health/all', async (req, res) => {
  const healthResults = {};
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${url}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        healthResults[name] = await response.json();
      } else {
        healthResults[name] = { status: 'degraded', code: response.status };
      }
    } catch (err) {
      healthResults[name] = { status: 'unreachable', error: err.message };
    }
  }

  res.json({
    gateway: { status: 'healthy', timestamp: new Date().toISOString() },
    services: healthResults
  });
});

// Proxy error handler with graceful degradation message
const onProxyError = (serviceName) => (err, req, res) => {
  console.error(`[GATEWAY ERROR] Routing to ${serviceName} failed:`, err.message);
  if (!res.headersSent) {
    res.status(503).json({
      error: 'Service Temporarily Unavailable',
      service: serviceName,
      message: `The ${serviceName} is currently unavailable or starting up. Downstream systems operate with fault isolation.`,
      requestId: req.requestId
    });
  }
};

// Custom proxy options helper using pathFilter to preserve full path
const createServiceProxy = (pathFilter, target, serviceName) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathFilter,
    headers: {
      'x-forwarded-by': 'bookend-api-gateway',
    },
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader('x-request-id', req.requestId || uuidv4());
      },
      error: onProxyError(serviceName)
    }
  });
};

// Route forwarders to individual microservices (paths are preserved)
// 1. Identity Service (Port 4001)
app.use(createServiceProxy(['/api/auth', '/api/users'], SERVICES.identity, 'identity-service'));

// 2. Catalog & Reading Service (Port 4002)
app.use(createServiceProxy(['/api/books', '/api/adaptations', '/api/library', '/api/ratings', '/api/reviews'], SERVICES.catalog, 'catalog-reading-service'));

// 3. Social Service (Port 4003)
app.use(createServiceProxy(['/api/storylab'], SERVICES.social, 'social-service'));

// 4. Recommendation Service (Port 4004)
app.use(createServiceProxy(['/api/recommendations', '/api/shelfmatch'], SERVICES.recommendation, 'recommendation-service'));

// 5. Engagement Service (Port 4005)
app.use(createServiceProxy(['/api/readquest', '/api/notifications'], SERVICES.engagement, 'engagement-service'));

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found on API Gateway',
    path: req.originalUrl,
    requestId: req.requestId
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[BOOKEND API GATEWAY] listening on port ${PORT}`);
  console.log(`Routing table:`);
  console.log(`  - /api/auth, /api/users          -> ${SERVICES.identity}`);
  console.log(`  - /api/books, /api/adaptations   -> ${SERVICES.catalog}`);
  console.log(`  - /api/library, /api/ratings     -> ${SERVICES.catalog}`);
  console.log(`  - /api/storylab                  -> ${SERVICES.social}`);
  console.log(`  - /api/recommendations           -> ${SERVICES.recommendation}`);
  console.log(`  - /api/shelfmatch                -> ${SERVICES.recommendation}`);
  console.log(`  - /api/readquest, /notifications -> ${SERVICES.engagement}`);
  console.log(`=======================================================`);
});
