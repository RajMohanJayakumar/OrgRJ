#!/bin/bash

# Stop Full-Stack Development Environment
# Stops all Go APIs, React frontends, and the gateway

echo "🛑 Stopping Full-Stack Development Environment..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Array of all services
services=("finclamp-api" "arcade-api" "engaged-api" "skips-api" "finclamp-frontend" "arcade-frontend" "engaged-frontend" "skips-frontend" "gateway")

# Function to stop a service
stop_service() {
    local name=$1
    local pid_file="logs/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}🛑 Stopping $name (PID: $pid)...${NC}"
            kill "$pid"
            rm "$pid_file"
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $name was not running${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${BLUE}ℹ️  No PID file found for $name${NC}"
    fi
}

# Stop each service
for name in "${services[@]}"; do
    stop_service "$name"
done

echo ""
echo -e "${BLUE}🔍 Checking for remaining processes on ports...${NC}"

# Kill any remaining processes on the ports
ports=(8001 8002 8003 8004 5173 5174 5175 5176 3000)
port_names=("FinClamp API" "Arcade API" "Engaged API" "Skips API" "FinClamp Frontend" "Arcade Frontend" "Engaged Frontend" "Skips Frontend" "Gateway")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}🛑 Killing $name on port $port (PID: $pid)${NC}"
        kill -9 "$pid" 2>/dev/null || true
    fi
done

echo ""
echo -e "${GREEN}🎉 Full-Stack Development Environment stopped!${NC}"
echo ""
echo -e "${BLUE}📋 To restart everything:${NC}"
echo "  ./scripts/dev-fullstack.sh"
echo "  or"
echo "  npm run fullstack:dev"
