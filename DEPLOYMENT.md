# 🚀 OrgR Deployment Strategy

This document outlines the deployment strategy for the OrgR monorepo, where **FinClamp** is deployed on GitHub Pages and the other three apps (**Arcade Games**, **Engaged**, **Skips**) are containerized using Docker.

## 📋 Overview

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────────────────────────┐
│   GitHub Pages  │    │           Docker Containers         │
│                 │    │                                     │
│   📊 FinClamp   │    │  🎮 Arcade  🎯 Engaged  🧠 Skips   │
│                 │    │                                     │
│  Static Hosting │    │     Nginx + Node.js Apps           │
└─────────────────┘    └─────────────────────────────────────┘
```

### Why This Architecture?

- **FinClamp**: Financial calculator suite deployed on GitHub Pages for free, reliable hosting
- **Other Apps**: Interactive games requiring more dynamic features, deployed in Docker containers
- **Separation**: Clear separation allows independent scaling and deployment strategies

## 🛠️ Quick Start Commands

### Development

```bash
# Start all apps including finclamp
make dev-all
# OR
npm run dev:all

# Start apps without finclamp (since it's on GitHub Pages)
make dev-no-finclamp
# OR
npm run dev:all-no-finclamp

# Start individual apps
npm run dev:finclamp
npm run dev:arcade
npm run dev:engaged
npm run dev:skips
```

### Production Deployment

```bash
# Deploy finclamp to GitHub Pages (automatic on push to main)
npm run deploy:finclamp

# Build and run other apps in Docker
make docker-build
make docker-up

# OR using docker-compose directly
docker-compose build
docker-compose up -d
```

## 📦 FinClamp (GitHub Pages)

### Configuration

- **Repository**: `prime` (current repo)
- **Branch**: `main`
- **Build Path**: `apps/finclamp/dist`
- **Base URL**: `/prime/` (configured in `vite.config.js`)

### Deployment Process

1. **Automatic**: Pushes to `main` branch with changes in `apps/finclamp/**` trigger deployment
2. **Manual**: Use `workflow_dispatch` in GitHub Actions
3. **Build**: Vite builds static assets to `dist/` folder
4. **Deploy**: GitHub Actions deploys to `gh-pages` branch

### Files Involved

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `apps/finclamp/vite.config.js` - Build configuration
- `apps/finclamp/package.json` - Build scripts

### Access

- **URL**: `https://yourusername.github.io/prime/`
- **Custom Domain**: Configure in repository settings if needed

## 🐳 Docker Apps (Arcade, Engaged, Skips)

### Architecture

Each app follows the same pattern:
- **Multi-stage build**: Node.js builder + Nginx production
- **Port mapping**: Different ports for each service
- **Health checks**: Built-in health monitoring
- **Nginx**: Optimized for SPA routing and static assets

### Port Configuration

| App | Development | Production | Container |
|-----|-------------|------------|-----------|
| Arcade Games | 5174 | 3001 | 80 |
| Engaged | 5175 | 3002 | 80 |
| Skips | 5176 | 3003 | 80 |

### Docker Commands

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up everything
docker-compose down -v --rmi all
```

### Files Involved

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration
- `apps/*/Dockerfile` - Individual app containers
- `apps/*/nginx.conf` - Nginx configurations
- `nginx-proxy.conf` - Reverse proxy configuration

## 🔧 Development Workflow

### Local Development

1. **All apps together**:
   ```bash
   npm run dev:all
   ```

2. **Without finclamp** (recommended when finclamp is live on GitHub Pages):
   ```bash
   npm run dev:all-no-finclamp
   ```

3. **Individual apps**:
   ```bash
   npm run dev:finclamp  # Port 5173
   npm run dev:arcade    # Port 5174
   npm run dev:engaged   # Port 5175
   npm run dev:skips     # Port 5176
   ```

### Docker Development

For testing containerized versions locally:

```bash
# Start development containers
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🚀 Production Deployment

### FinClamp Deployment

**Automatic**: 
- Push changes to `main` branch
- GitHub Actions automatically builds and deploys

**Manual**:
1. Go to GitHub Actions tab
2. Select "Deploy FinClamp to GitHub Pages"
3. Click "Run workflow"

### Docker Apps Deployment

**On your server**:

```bash
# Clone repository
git clone <your-repo-url>
cd prime

# Build and start services
make docker-build
make docker-up

# Check status
make status
```

**With reverse proxy** (recommended for production):

```bash
# Start with nginx proxy
docker-compose --profile production up -d
```

This provides:
- Single entry point at port 80
- Load balancing
- SSL termination (when configured)
- Centralized logging

## 📊 Monitoring & Health Checks

### Built-in Health Checks

Each Docker container includes health checks:

```bash
# Check container health
docker ps

# View health check logs
docker inspect <container-name> | grep -A 10 Health
```

### Access URLs

**Development**:
- FinClamp: `http://localhost:5173`
- Arcade Games: `http://localhost:5174`
- Engaged: `http://localhost:5175`
- Skips: `http://localhost:5176`

**Production**:
- FinClamp: `https://yourusername.github.io/prime/`
- Arcade Games: `http://your-server:3001`
- Engaged: `http://your-server:3002`
- Skips: `http://your-server:3003`
- Proxy Dashboard: `http://your-server:80`

## 🔄 Making Changes

### Adding New Apps

1. **Create app** in `apps/` directory
2. **Add to package.json** scripts:
   ```json
   "dev:newapp": "npm run dev --workspace=apps/newapp",
   "build:newapp": "npm run build --workspace=apps/newapp"
   ```
3. **Update dev-all.js** to include new app
4. **Create Dockerfile** following existing pattern
5. **Add to docker-compose.yml**

### Changing Deployment Strategy

#### Moving FinClamp to Docker

1. **Create Dockerfile** in `apps/finclamp/`
2. **Add to docker-compose.yml**
3. **Remove GitHub Pages workflow** or modify paths
4. **Update base URL** in `vite.config.js`

#### Moving Docker App to GitHub Pages

1. **Create GitHub workflow** similar to finclamp
2. **Configure base URL** in app's build config
3. **Remove from docker-compose.yml**
4. **Update development scripts**

### Environment Variables

Create `.env` file for environment-specific configurations:

```env
# Docker configuration
COMPOSE_PROJECT_NAME=orgr
NGINX_PORT=80

# Development ports
ARCADE_DEV_PORT=5174
ENGAGED_DEV_PORT=5175
SKIPS_DEV_PORT=5176

# Production ports
ARCADE_PROD_PORT=3001
ENGAGED_PROD_PORT=3002
SKIPS_PROD_PORT=3003
```

## 🛡️ Security Considerations

### GitHub Pages (FinClamp)

- ✅ HTTPS by default
- ✅ Static files only (secure)
- ✅ No server-side vulnerabilities
- ⚠️ Public repository (code visible)

### Docker Containers

- 🔒 **Nginx security headers** configured
- 🔒 **Health checks** for monitoring
- 🔒 **Non-root user** in containers
- 🔒 **Minimal base images** (Alpine Linux)
- ⚠️ **Update regularly** for security patches

### Recommendations

1. **Use HTTPS** in production (Let's Encrypt)
2. **Regular updates** of dependencies
3. **Monitor logs** for suspicious activity
4. **Backup configurations** and data

## 📚 Troubleshooting

### Common Issues

**GitHub Pages not updating**:
- Check GitHub Actions logs
- Verify `base` path in `vite.config.js`
- Ensure repository has Pages enabled

**Docker containers not starting**:
- Check port conflicts: `docker ps`
- View logs: `docker-compose logs <service>`
- Verify Docker daemon is running

**Build failures**:
- Clear node_modules: `npm run clean`
- Reinstall dependencies: `npm run install:all`
- Check Node.js version compatibility

### Useful Commands

```bash
# View all running processes
make status

# Clean everything and restart
make clean
make install
make docker-clean
make docker-build
make docker-up

# Debug specific service
docker-compose logs -f <service-name>
docker exec -it <container-name> /bin/sh
```

## 📞 Support

For issues or questions:

1. **Check logs** first using commands above
2. **Review this documentation**
3. **Check GitHub Issues** in the repository
4. **Create new issue** with detailed information

---

*Last updated: $(date)*
*Version: 1.0.0*
