# Prime Monorepo

A monorepo containing multiple React applications: finclamp, arcade-games, engaged, and skips.

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

Run all apps in development mode:

```bash
npm run dev
```

Run specific apps:

```bash
npm run dev:finclamp      # FinClamp
npm run dev:arcade        # Arcade Games
npm run dev:engaged       # Engaged
npm run dev:skips         # Skips
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

## Deployment

### GitHub Pages (FinClamp)

The finclamp app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

Manual deployment:

```bash
npm run deploy:finclamp
```

## Project Structure

```
prime-monorepo/
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
