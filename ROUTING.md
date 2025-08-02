# 🗺️ Universal Gateway Routing Map

This document provides a comprehensive overview of the routing structure for the OrgRJ monorepo universal gateway system.

## 🌐 Gateway Entry Point

**Base URL**: `http://localhost:3000`

All applications and APIs are accessible through this single entry point.

---

## 🎨 Frontend Applications

### 💰 FinClamp - Financial Calculator Suite

- **Primary URL**: `/finclamp`
- **Aliases**: `/finance`, `/calculator`
- **Direct Routes**:
  - `/calculators` - Direct access to calculator pages
  - `/games` - Direct access to finance games
- **Description**: Comprehensive financial calculator suite with loan, savings, and investment calculators
- **Dev Server**: `localhost:5173`
- **Production Build**: `/apps/finclamp/dist`

#### FinClamp URL Patterns:

- **Calculator Access**: `http://localhost:3000/calculators?currency=dollar&in=emi`
- **Finance Games**: `http://localhost:3000/games?in=finance-quest`
- **Supported Parameters**:
  - `in` - Calculator/game identifier (e.g., `emi`, `sip`, `finance-quest`)
  - `currency` - Currency setting (e.g., `dollar`, `rupee`)
  - `calculator` - Legacy calculator parameter
  - `category` - Calculator category

### 🎮 Arcade Games - Retro Game Collection

- **Primary URL**: `/arcade`
- **Aliases**: `/retro-games`
- **Description**: Collection of classic arcade games with leaderboards
- **Dev Server**: `localhost:5174`
- **Production Build**: `/apps/arcade-games/dist`

### 💍 Engaged - Wedding Planning Platform

- **Primary URL**: `/engaged`
- **Aliases**: `/wedding`, `/planning`
- **Description**: Complete wedding planning and management platform
- **Dev Server**: `localhost:5175`
- **Production Build**: `/apps/engaged/dist`

### ⏭️ Skips Tracker - Skip Rope Fitness Tracker

- **Primary URL**: `/skips`
- **Aliases**: `/fitness`, `/tracker`
- **Description**: Skip rope fitness tracking with statistics and goals
- **Dev Server**: `localhost:5176`
- **Production Build**: `/apps/skips/dist`

---

## 🔧 Backend APIs

All APIs follow the pattern: `/api/{service}/{endpoint}`

### 💰 FinClamp API (`/api/finclamp`)

- **Base URL**: `/api/finclamp`
- **Server**: `localhost:8001`
- **Path Rewrite**: `/api/finclamp/*` → `/api/v1/*`

**Endpoints**:

- `GET /api/finclamp/health` - Health check
- `POST /api/finclamp/calculate/loan` - Loan calculations
- `POST /api/finclamp/calculate/savings` - Savings calculations
- `POST /api/finclamp/calculate/investment` - Investment calculations

### 🎮 Arcade API (`/api/arcade`)

- **Base URL**: `/api/arcade`
- **Server**: `localhost:8002`
- **Path Rewrite**: `/api/arcade/*` → `/api/v1/*`

**Endpoints**:

- `GET /api/arcade/health` - Health check
- `GET /api/arcade/games` - List all games
- `GET /api/arcade/games/:id` - Get specific game
- `GET /api/arcade/leaderboard` - Get leaderboard
- `POST /api/arcade/score` - Submit new score

### 💍 Engaged API (`/api/engaged`)

- **Base URL**: `/api/engaged`
- **Server**: `localhost:8003`
- **Path Rewrite**: `/api/engaged/*` → `/api/v1/*`

**Endpoints**:

- `GET /api/engaged/health` - Health check
- `GET /api/engaged/engagements` - List engagements
- `POST /api/engaged/engagements` - Create engagement
- `GET /api/engaged/tasks/:id` - Get tasks for engagement
- `POST /api/engaged/tasks` - Create task

### ⏭️ Skips API (`/api/skips`)

- **Base URL**: `/api/skips`
- **Server**: `localhost:8004`
- **Path Rewrite**: `/api/skips/*` → `/api/v1/*`

**Endpoints**:

- `GET /api/skips/health` - Health check
- `GET /api/skips/sessions` - List skip sessions
- `POST /api/skips/sessions` - Record new session
- `GET /api/skips/stats/:user` - Get user statistics
- `GET /api/skips/goals/:user` - Get user goals

---

## 🏠 Special Routes

### Gateway Landing Page

- **URL**: `/`
- **Description**: Interactive landing page with navigation to all apps
- **Features**: App cards, health status, routing information

### Health Check

- **URL**: `/health`
- **Description**: Gateway health status and service overview
- **Response**: JSON with gateway status and route count

---

## 🔄 Environment-Based Routing

### Development Mode

- **Frontend Apps**: Proxied to Vite dev servers (ports 5173-5176)
- **Hot Module Replacement**: Enabled with WebSocket support
- **Base Paths**: Clean URLs (no `/prime` prefix)

### Production Mode

- **Frontend Apps**: Served as static builds from `/dist` directories
- **Base Paths**: Configured for deployment (e.g., `/prime` for GitHub Pages)

---

## 🛠️ Configuration Files

### Primary Configuration

- **`gateway/routes-map.js`**: Master routing configuration
- **`gateway/config.js`**: Generated gateway configuration
- **`gateway/index.js`**: Gateway server implementation

### Frontend Configuration

- **`apps/*/vite.config.js`**: Vite configuration with environment-based base paths
- **`package.json`**: NPM scripts for development and production

---

## 🧪 Testing Routes

### Quick Health Checks

```bash
# Gateway health
curl http://localhost:3000/health

# API health checks
curl http://localhost:3000/api/finclamp/health
curl http://localhost:3000/api/arcade/health
curl http://localhost:3000/api/engaged/health
curl http://localhost:3000/api/skips/health
```

### Frontend Access

```bash
# Direct access
open http://localhost:3000/finclamp
open http://localhost:3000/arcade
open http://localhost:3000/engaged
open http://localhost:3000/skips

# Alias access
open http://localhost:3000/finance
open http://localhost:3000/games
open http://localhost:3000/wedding
open http://localhost:3000/fitness
```

### API Testing

```bash
# Get arcade games
curl http://localhost:3000/api/arcade/games

# Calculate loan
curl -X POST http://localhost:3000/api/finclamp/calculate/loan \
  -H "Content-Type: application/json" \
  -d '{"principal": 100000, "rate": 5, "term": 30}'
```

---

## 🎯 Key Benefits

1. **🚪 Single Entry Point**: All services accessible via `localhost:3000`
2. **🔗 Clean URLs**: Intuitive routing with meaningful aliases
3. **🔄 Environment Awareness**: Different behavior for dev vs production
4. **📱 Mobile Friendly**: Responsive design with touch-friendly navigation
5. **🛡️ Health Monitoring**: Built-in health checks for all services
6. **🎮 Developer Experience**: Hot-reload, WebSocket support, comprehensive logging

---

## 🚀 Quick Start

```bash
# Start everything with clean ports
npm run fullstack:clean

# Access the gateway
open http://localhost:3000

# Try different routes
open http://localhost:3000/finance
open http://localhost:3000/games
```

This routing system provides a professional, scalable foundation for the monorepo with clear separation of concerns and excellent developer experience.
