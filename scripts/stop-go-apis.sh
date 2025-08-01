#!/bin/bash

# Universal Gateway System Stop Script
# This script stops all Go APIs and the gateway

echo "🛑 Stopping Universal Gateway System..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Array of service names (APIs + Gateway)
services=("finclamp" "arcade" "engaged" "skips" "gateway")

# Function to stop a service
stop_service() {
    local name=$1
    local pid_file="logs/${name}-api.pid"

    # Handle gateway differently
    if [ "$name" = "gateway" ]; then
        pid_file="logs/gateway.pid"
    fi

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

# Also kill any remaining processes on the ports
echo ""
echo -e "${BLUE}🔍 Checking for remaining processes on ports...${NC}"

ports=(8001 8002 8003 8004 3000)
for port in "${ports[@]}"; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}🛑 Killing process on port $port (PID: $pid)${NC}"
        kill -9 "$pid" 2>/dev/null || true
    fi
done

echo ""
echo -e "${GREEN}🎉 Universal Gateway System stopped!${NC}"
