#!/bin/bash

# Port Status Checker
# Quick utility to check which ports are in use

echo "🔍 Port Status Check"
echo "==================="

# Define all ports used by the system
declare -A ports=(
    [3000]="Gateway"
    [5173]="FinClamp Frontend"
    [5174]="Arcade Frontend"
    [5175]="Engaged Frontend"
    [5176]="Skips Frontend"
    [8001]="FinClamp API"
    [8002]="Arcade API"
    [8003]="Engaged API"
    [8004]="Skips API"
)

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Checking system ports..."
echo ""

all_free=true

for port in "${!ports[@]}"; do
    service=${ports[$port]}
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        pid=$(lsof -ti:$port)
        echo -e "${RED}🔴 Port $port (${service}) - IN USE (PID: $pid)${NC}"
        all_free=false
    else
        echo -e "${GREEN}🟢 Port $port (${service}) - FREE${NC}"
    fi
done

echo ""

if [ "$all_free" = true ]; then
    echo -e "${GREEN}✅ All ports are free! Ready to start the system.${NC}"
    echo ""
    echo "Start commands:"
    echo "  npm run fullstack:clean  # Clean start (recommended)"
    echo "  npm run fullstack:dev    # Regular start"
else
    echo -e "${YELLOW}⚠️  Some ports are in use. Options:${NC}"
    echo ""
    echo "Stop current system:"
    echo "  npm run fullstack:stop"
    echo ""
    echo "Or force clean start:"
    echo "  npm run fullstack:clean  # Will kill existing processes"
fi

echo ""
echo "Quick status check:"
echo "  ./scripts/check-ports.sh"
