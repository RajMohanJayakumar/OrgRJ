# OrgR Monorepo

A monorepo containing multiple React applications with hybrid deployment strategy:

- **FinClamp**: Deployed on GitHub Pages
- **Other Apps**: Containerized with Docker

## Projects

### Apps

- **finclamp** - Financial calculator suite (deployed to GitHub Pages)
- **arcade-games** - Collection of classic arcade games
- **engaged** - Interactive multiplayer games with WebSocket connectivity
- **skips** - Multi-modal memory training game

### Packages

- **shared** - Common utilities and components shared across apps

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Quick Start

The monorepo is now fully set up and ready to use! All four projects have been successfully converted to standalone React applications following the finclamp reference structure.

### Development

**All apps including finclamp:**

```bash
npm run dev:all
# OR
make dev-all
```

**Apps without finclamp** (recommended when finclamp is live on GitHub Pages):

```bash
npm run dev:all-no-finclamp
# OR
make dev-no-finclamp
```

**Individual apps:**

```bash
npm run dev:finclamp      # FinClamp (Port 5173)
npm run dev:arcade        # Arcade Games (Port 5174)
npm run dev:engaged       # Engaged (Port 5175)
npm run dev:skips         # Skips (Port 5176)
```

### Building

Build all apps:

```bash
npm run build
```

Build specific apps:

```bash
npm run build:finclamp
npm run build:arcade
npm run build:engaged
npm run build:skips
```

### Testing

Run tests for all apps:

```bash
npm run test
```

Run tests for specific apps:

```bash
npm run test:finclamp
npm run test:arcade
npm run test:engaged
npm run test:skips
```

## 🚀 Deployment

### FinClamp (GitHub Pages)

**Automatic deployment** on push to `main` branch:

- Triggers when `apps/finclamp/**` files change
- Builds and deploys to GitHub Pages
- Access: `https://yourusername.github.io/prime/`

**Manual deployment:**

```bash
npm run deploy:finclamp
```

### Other Apps (Docker Containers)

**Production deployment:**

```bash
# Build and start all containers
make docker-build
make docker-up

# OR using docker-compose directly
docker-compose build
docker-compose up -d
```

**Access URLs:**

- Arcade Games: `http://localhost:3001`
- Engaged: `http://localhost:3002`
- Skips: `http://localhost:3003`
- Proxy Dashboard: `http://localhost:80`

**Docker commands:**

```bash
make docker-logs      # View logs
make docker-restart   # Restart services
make docker-down      # Stop services
make docker-clean     # Clean up everything
make status           # Check container status
```

### Make Commands Reference

```bash
make help             # Show all available commands
make dev-all          # Start all apps in development
make dev-no-finclamp  # Start apps without finclamp
make build            # Build all apps
make test             # Run all tests
make docker-up        # Start production containers
```

📚 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Project Structure

```
orgrj-monorepo/
├── apps/
│   ├── finclamp/              # Main financial calculator app
│   ├── arcade-games/          # Arcade games collection
│   ├── engaged/               # Interactive multiplayer games
│   └── skips/                 # Memory training game
├── packages/
│   └── shared/                # Shared utilities and components
├── package.json               # Root package.json with workspaces
└── README.md                  # This file
```

## Contributing

1. Make changes in the appropriate app or package
2. Test your changes: `npm run test`
3. Build to ensure everything works: `npm run build`
4. Commit and push your changes

## License

ISC
