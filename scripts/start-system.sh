#!/bin/bash

# Universal Gateway System Startup Script
# Starts all Go APIs and the gateway in the correct order

set -e

echo "🚀 Starting Universal Gateway System..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start within $max_attempts seconds${NC}"
    return 1
}

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo -e "${RED}❌ Go is not installed. Please install Go first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking ports...${NC}"

# Check if ports are available
ports=(8001 8002 8003 8004 3000)
port_names=("FinClamp API" "Arcade API" "Engaged API" "Skips API" "Gateway")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    if ! check_port $port; then
        echo -e "${YELLOW}⚠️  Port $port is already in use (${name}). Attempting to continue...${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available (${name})${NC}"
    fi
done

echo ""
echo -e "${BLUE}🔧 Starting Go APIs...${NC}"

# Start Go APIs in background
apis=("finclamp:8001" "arcade:8002" "engaged:8003" "skips:8004")

for api_info in "${apis[@]}"; do
    IFS=':' read -r name port <<< "$api_info"
    
    echo -e "${YELLOW}🚀 Starting $name API on port $port...${NC}"
    
    # Start the API in background
    cd "apps/api-${name}-go"
    go mod tidy > /dev/null 2>&1
    nohup go run main.go > "../../logs/${name}-api.log" 2>&1 &
    api_pid=$!
    echo $api_pid > "../../logs/${name}-api.pid"
    cd - > /dev/null
    
    echo -e "${GREEN}✅ $name API started (PID: $api_pid)${NC}"
    sleep 2  # Give each service time to start
done

echo ""
echo -e "${BLUE}⏳ Waiting for APIs to be ready...${NC}"

# Wait for APIs to be ready
for api_info in "${apis[@]}"; do
    IFS=':' read -r name port <<< "$api_info"
    wait_for_service "http://localhost:$port/api/v1/health" "${name^} API"
done

echo ""
echo -e "${BLUE}🌐 Starting Gateway...${NC}"

# Start the gateway
npm run gateway &
gateway_pid=$!
echo $gateway_pid > logs/gateway.pid

# Wait for gateway to be ready
wait_for_service "http://localhost:3000/health" "Gateway"

echo ""
echo -e "${GREEN}🎉 Universal Gateway System is running!${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}📡 Access Points:${NC}"
echo "  🌐 Gateway:        http://localhost:3000"
echo "  💰 FinClamp API:   http://localhost:8001"
echo "  🎮 Arcade API:     http://localhost:8002"
echo "  💍 Engaged API:    http://localhost:8003"
echo "  ⏭️  Skips API:      http://localhost:8004"
echo ""
echo -e "${BLUE}🔗 Gateway Routes:${NC}"
echo "  📄 Landing Page:   http://localhost:3000/"
echo "  ❤️  Health Check:   http://localhost:3000/health"
echo "  💰 FinClamp:       http://localhost:3000/api/finclamp/*"
echo "  🎮 Arcade:         http://localhost:3000/api/arcade/*"
echo "  💍 Engaged:        http://localhost:3000/api/engaged/*"
echo "  ⏭️  Skips:          http://localhost:3000/api/skips/*"
echo ""
echo -e "${YELLOW}📝 Logs are available in the logs/ directory${NC}"
echo -e "${YELLOW}🛑 To stop all services, run: ./scripts/stop-system.sh${NC}"
echo ""

# Keep the script running to show logs
echo -e "${BLUE}📊 Monitoring services... (Press Ctrl+C to stop monitoring)${NC}"
echo "========================================"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping monitoring...${NC}"
    echo -e "${BLUE}Services are still running in the background.${NC}"
    echo -e "${BLUE}Use ./scripts/stop-system.sh to stop all services.${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Monitor services
while true; do
    sleep 5
    
    # Check if services are still running
    all_running=true
    
    for api_info in "${apis[@]}"; do
        IFS=':' read -r name port <<< "$api_info"
        if ! curl -s "http://localhost:$port/api/v1/health" > /dev/null 2>&1; then
            echo -e "${RED}❌ ${name^} API is not responding${NC}"
            all_running=false
        fi
    done
    
    if ! curl -s "http://localhost:3000/health" > /dev/null 2>&1; then
        echo -e "${RED}❌ Gateway is not responding${NC}"
        all_running=false
    fi
    
    if [ "$all_running" = true ]; then
        echo -e "${GREEN}✅ All services are healthy ($(date))${NC}"
    fi
done
