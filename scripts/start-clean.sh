#!/bin/bash

# Clean Start Script - Ensures all ports are free before starting
# This script kills any processes on required ports and starts fresh

set -e

echo "🧹 Clean Start - Universal Gateway System"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# All required ports
ports=(8001 8002 8003 8004 5173 5174 5175 5176 3000)
port_names=("FinClamp API" "Arcade API" "Engaged API" "Skips API" "FinClamp Frontend" "Arcade Frontend" "Engaged Frontend" "Skips Frontend" "Gateway")

echo -e "${BLUE}🔍 Checking and cleaning ports...${NC}"

# Kill any processes on required ports
for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}🛑 Killing process on port $port ($name) - PID: $pid${NC}"
        kill -9 "$pid" 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}✅ Port $port is free ($name)${NC}"
    fi
done

echo ""
echo -e "${BLUE}🚀 Starting services with guaranteed port allocation...${NC}"

# Wait a moment for ports to be fully released
sleep 2

# Start the full-stack system
echo -e "${YELLOW}🎯 Launching full-stack development environment...${NC}"
npm run fullstack:dev

echo ""
echo -e "${GREEN}🎉 Clean start completed!${NC}"
