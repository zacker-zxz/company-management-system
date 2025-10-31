# Zacker Management System - Deployment Guide

This guide covers deploying the Zacker Management System to production environments.

## 🚀 Production Deployment Options

### Option 1: Vercel + MongoDB Atlas (Recommended)

#### Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Environment Variables**
   Create `.env.local` in your project root:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   NEXT_PUBLIC_APP_NAME=Zacker Management System
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

3. **Deploy to Vercel**
   ```bash
   # Deploy
   vercel --prod
   
   # Or connect to GitHub for automatic deployments
   vercel --prod --github
   ```

#### Backend Deployment (Railway/Render/Heroku)

1. **Prepare Backend**
   ```bash
   cd backend
   
   # Install production dependencies only
   npm ci --only=production
   ```

2. **Environment Variables**
   Set these in your hosting platform:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zacker_management
   JWT_SECRET=your-super-secure-production-secret-key
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@zacker.com
   FROM_NAME=Zacker Management System
   ```

3. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy backend
COPY --from=deps /app/backend ./backend

# Set permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && npm start & npm start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/zacker_management
      - JWT_SECRET=your-production-secret
      - ALLOWED_ORIGINS=http://localhost:3000
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

#### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Kubernetes Deployment

#### Create Kubernetes Manifests

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zacker-system

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zacker-config
  namespace: zacker-system
data:
  NODE_ENV: "production"
  PORT: "5000"
  JWT_EXPIRES_IN: "15m"
  REFRESH_TOKEN_EXPIRES_IN: "7d"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: zacker-secrets
  namespace: zacker-system
type: Opaque
data:
  MONGODB_URI: <base64-encoded-uri>
  JWT_SECRET: <base64-encoded-secret>
  SMTP_PASS: <base64-encoded-password>

---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zacker-app
  namespace: zacker-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zacker-app
  template:
    metadata:
      labels:
        app: zacker-app
    spec:
      containers:
      - name: frontend
        image: zacker-frontend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: zacker-config
        - secretRef:
            name: zacker-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      - name: backend
        image: zacker-backend:latest
        ports:
        - containerPort: 5000
        envFrom:
        - configMapRef:
            name: zacker-config
        - secretRef:
            name: zacker-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: zacker-service
  namespace: zacker-system
spec:
  selector:
    app: zacker-app
  ports:
  - name: frontend
    port: 80
    targetPort: 3000
  - name: backend
    port: 5000
    targetPort: 5000
  type: LoadBalancer

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zacker-ingress
  namespace: zacker-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - zacker.yourdomain.com
    secretName: zacker-tls
  rules:
  - host: zacker.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: zacker-service
            port:
              number: 80
```

#### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# Check deployment
kubectl get pods -n zacker-system
kubectl get services -n zacker-system
kubectl get ingress -n zacker-system
```

## 🔧 Production Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.zacker.com
NEXT_PUBLIC_APP_NAME=Zacker Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

#### Backend (.env)
```env
# Application
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zacker_management

# Security
JWT_SECRET=your-super-secure-production-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS
ALLOWED_ORIGINS=https://zacker.com,https://www.zacker.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@zacker.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@zacker.com
FROM_NAME=Zacker Management System

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=info
LOG_FILE_MAX_SIZE=10m
LOG_FILE_MAX_FILES=5

# Redis (for production caching)
REDIS_URL=redis://redis:6379

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Database Setup

#### MongoDB Atlas Configuration

1. **Create Cluster**
   - Choose M10 or higher for production
   - Enable backup and monitoring
   - Configure IP whitelist

2. **Database User**
   ```javascript
   // Create production user
   db.createUser({
     user: "zacker_prod",
     pwd: "secure_password",
     roles: [
       { role: "readWrite", db: "zacker_management" }
     ]
   })
   ```

3. **Indexes**
   ```bash
   # Run index creation script
   node backend/scripts/createIndexes.js
   ```

### SSL/TLS Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name zacker.com www.zacker.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zacker.com www.zacker.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin https://zacker.com;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Access-Control-Allow-Credentials true;
    }
}
```

## 📊 Monitoring & Logging

### Application Monitoring

#### Health Checks
```bash
# Frontend health
curl https://zacker.com/api/health

# Backend health
curl https://api.zacker.com/api/health
```

#### Log Monitoring
```bash
# View application logs
docker-compose logs -f app

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Performance Monitoring

#### Database Monitoring
```javascript
// Monitor slow queries
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

#### Cache Monitoring
```bash
# Check cache statistics
curl https://api.zacker.com/api/cache/stats
```

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment variables for secrets
- [ ] Set up database authentication
- [ ] Configure firewall rules
- [ ] Enable audit logging

### Post-Deployment Security

- [ ] Test all authentication flows
- [ ] Verify HTTPS is working
- [ ] Check security headers
- [ ] Test rate limiting
- [ ] Verify CORS configuration
- [ ] Test password reset flow
- [ ] Check email delivery
- [ ] Monitor for security issues
- [ ] Set up security alerts
- [ ] Regular security updates

## 🚀 Deployment Scripts

### Automated Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting Zacker deployment..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Build backend
echo "📦 Building backend..."
cd backend
npm ci --only=production
cd ..

# Run tests
echo "🧪 Running tests..."
npm test
cd backend && npm test && cd ..

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

# Deploy backend
echo "🚀 Deploying backend..."
cd backend
railway up
cd ..

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: https://zacker.vercel.app"
echo "🔧 Backend: https://zacker-api.railway.app"
```

### Database Migration Script

```bash
#!/bin/bash
# migrate.sh

echo "🗄️ Running database migrations..."

# Create indexes
node backend/scripts/createIndexes.js

# Create admin user
node backend/scripts/createAdmin.js

# Create sample data (optional)
read -p "Create sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    node backend/scripts/createSampleData.js
fi

echo "✅ Database migration completed!"
```

## 📈 Performance Optimization

### Frontend Optimization

1. **Image Optimization**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   ```

2. **Code Splitting**
   ```javascript
   // Dynamic imports
   const AdminDashboard = dynamic(() => import('./AdminDashboard'))
   const EmployeeDashboard = dynamic(() => import('./EmployeeDashboard'))
   ```

3. **Caching Strategy**
   ```javascript
   // Service worker for offline support
   // Implement caching strategies
   ```

### Backend Optimization

1. **Database Optimization**
   ```javascript
   // Connection pooling
   const mongoose = require('mongoose');
   mongoose.connect(uri, {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   });
   ```

2. **Caching Implementation**
   ```javascript
   // Redis caching
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   ```

3. **Compression**
   ```javascript
   // Enable compression
   app.use(compression());
   ```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Check CORS configuration
   curl -H "Origin: https://your-domain.com" https://api.zacker.com/api/health
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/zacker_management"
   ```

3. **Email Delivery Issues**
   ```bash
   # Test SMTP configuration
   node backend/scripts/testEmail.js
   ```

### Performance Issues

1. **Slow Queries**
   ```javascript
   // Enable query profiling
   db.setProfilingLevel(2)
   ```

2. **Memory Leaks**
   ```bash
   # Monitor memory usage
   docker stats
   ```

3. **High CPU Usage**
   ```bash
   # Check CPU usage
   top -p $(pgrep node)
   ```

## 📞 Support

For deployment support:

- **Documentation**: [GitHub Wiki](https://github.com/your-username/zacker-management-system/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/zacker-management-system/issues)
- **Email**: support@zacker.com

---

**Happy Deploying! 🚀**
