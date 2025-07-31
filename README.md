# Prime Monorepo

A monorepo containing multiple React applications and shared packages.

## Projects

### Apps

- **workouts-calculator** - Financial calculator suite (deployed to GitHub Pages)
- **arcade-games** - Collection of classic arcade games
- **engagements** - Interactive multiplayer games with WebSocket connectivity
- **skip-danger** - Multi-modal memory training game

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

The monorepo is now fully set up and ready to use! All four projects have been successfully converted to standalone React applications following the workouts-calculator reference structure.

### Development

Run all apps in development mode:

```bash
npm run dev
```

Run specific apps:

```bash
npm run dev:workouts      # Workouts Calculator
npm run dev:arcade        # Arcade Games
npm run dev:engagements   # Engagements
npm run dev:skip-danger   # Skip Danger
```

### Building

Build all apps:

```bash
npm run build
```

Build specific apps:

```bash
npm run build:workouts
npm run build:arcade
npm run build:engagements
npm run build:skip-danger
```

### Testing

Run tests for all apps:

```bash
npm run test
```

Run tests for specific apps:

```bash
npm run test:workouts
npm run test:arcade
npm run test:engagements
npm run test:skip-danger
```

## Deployment

### GitHub Pages (Workouts Calculator)

The workouts-calculator app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

Manual deployment:

```bash
npm run deploy:workouts
```

## Project Structure

```
prime-monorepo/
├── apps/
│   ├── workouts-calculator/    # Main financial calculator app
│   ├── arcade-games/          # Arcade games collection
│   ├── engagements/           # Interactive multiplayer games
│   └── skip-danger/           # Memory training game
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
