#!/bin/bash

# Universal Gateway System Stop Script
# Stops all Go APIs and the gateway

set -e

echo "🛑 Stopping Universal Gateway System..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop a service by PID file
stop_service() {
    local name=$1
    local pid_file="logs/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping $name (PID: $pid)...${NC}"
            kill "$pid"
            
            # Wait for process to stop
            local attempts=0
            while kill -0 "$pid" 2>/dev/null && [ $attempts -lt 10 ]; do
                sleep 1
                attempts=$((attempts + 1))
            done
            
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${RED}Force killing $name...${NC}"
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            rm "$pid_file"
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${YELLOW}$name was not running${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "${BLUE}No PID file found for $name${NC}"
    fi
}

# Function to stop processes by port
stop_by_port() {
    local port=$1
    local name=$2
    
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Stopping processes on port $port ($name)...${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ Stopped processes on port $port${NC}"
    else
        echo -e "${BLUE}No processes found on port $port ($name)${NC}"
    fi
}

# Create logs directory if it doesn't exist
mkdir -p logs

echo -e "${BLUE}🔍 Stopping services by PID files...${NC}"

# Stop services using PID files
services=("finclamp-api" "arcade-api" "engaged-api" "skips-api" "gateway")
for service in "${services[@]}"; do
    stop_service "$service"
done

echo ""
echo -e "${BLUE}🔍 Stopping any remaining processes by port...${NC}"

# Stop any remaining processes by port
ports_info=("8001:FinClamp API" "8002:Arcade API" "8003:Engaged API" "8004:Skips API" "3000:Gateway")
for port_info in "${ports_info[@]}"; do
    IFS=':' read -r port name <<< "$port_info"
    stop_by_port "$port" "$name"
done

echo ""
echo -e "${BLUE}🧹 Cleaning up log files...${NC}"

# Optional: Clean up old log files (uncomment if desired)
# rm -f logs/*.log

echo ""
echo -e "${GREEN}🎉 Universal Gateway System stopped successfully!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}📝 Log files are preserved in logs/ directory${NC}"
echo -e "${BLUE}🚀 To start the system again, run: ./scripts/start-system.sh${NC}"
