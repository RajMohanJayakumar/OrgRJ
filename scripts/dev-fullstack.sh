#!/bin/bash

# Full-Stack Development Environment Startup
# Starts all Go APIs, React frontends, and the gateway

set -e

echo "🚀 Starting Full-Stack Development Environment..."
echo "================================================="

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
    
    echo -e "${YELLOW}⏳ Waiting for $name to be ready...${NC}"
    
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

echo -e "${BLUE}📋 Checking required ports...${NC}"

# Check all required ports
ports=(8001 8002 8003 8004 5173 5174 5175 5176 3000)
port_names=("FinClamp API" "Arcade API" "Engaged API" "Skips API" "FinClamp Frontend" "Arcade Frontend" "Engaged Frontend" "Skips Frontend" "Gateway")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    if ! check_port $port; then
        echo -e "${YELLOW}⚠️  Port $port is already in use (${name})${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available (${name})${NC}"
    fi
done

echo ""
echo -e "${BLUE}🔧 Starting Go APIs...${NC}"

# Create logs directory
mkdir -p logs

# Start Go APIs
apis=(
    "finclamp:8001:apps/api-finclamp-go"
    "arcade:8002:apps/api-arcade-go"
    "engaged:8003:apps/api-engaged-go"
    "skips:8004:apps/api-skips-go"
)

for api_info in "${apis[@]}"; do
    IFS=':' read -r name port dir <<< "$api_info"
    
    echo -e "${YELLOW}🚀 Starting $name API on port $port...${NC}"
    
    if [ -d "$dir" ]; then
        cd "$dir"
        go mod tidy > /dev/null 2>&1
        nohup go run main.go > "../../logs/${name}-api.log" 2>&1 &
        echo $! > "../../logs/${name}-api.pid"
        cd - > /dev/null
        echo -e "${GREEN}✅ $name API started (PID: $(cat logs/${name}-api.pid))${NC}"
    else
        echo -e "${RED}❌ Directory $dir not found${NC}"
    fi
    
    sleep 2
done

echo ""
echo -e "${BLUE}🌐 Starting React Frontend Servers...${NC}"

# Start React development servers
frontends=(
    "finclamp:5173:apps/finclamp"
    "arcade:5174:apps/arcade-games"
    "engaged:5175:apps/engaged"
    "skips:5176:apps/skips"
)

for frontend_info in "${frontends[@]}"; do
    IFS=':' read -r name port dir <<< "$frontend_info"
    
    echo -e "${YELLOW}🚀 Starting $name frontend on port $port...${NC}"
    
    if [ -d "$dir" ]; then
        cd "$dir"
        nohup npm run dev -- --port $port --host > "../../logs/${name}-frontend.log" 2>&1 &
        echo $! > "../../logs/${name}-frontend.pid"
        cd - > /dev/null
        echo -e "${GREEN}✅ $name frontend started (PID: $(cat logs/${name}-frontend.pid))${NC}"
    else
        echo -e "${RED}❌ Directory $dir not found${NC}"
    fi
    
    sleep 3
done

echo ""
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"

# Wait for APIs to be ready
wait_for_service "http://localhost:8001/api/v1/health" "FinClamp API"
wait_for_service "http://localhost:8002/api/v1/health" "Arcade API"
wait_for_service "http://localhost:8003/api/v1/health" "Engaged API"
wait_for_service "http://localhost:8004/api/v1/health" "Skips API"

# Wait for frontends to be ready
wait_for_service "http://localhost:5173" "FinClamp Frontend"
wait_for_service "http://localhost:5174" "Arcade Frontend"
wait_for_service "http://localhost:5175" "Engaged Frontend"
wait_for_service "http://localhost:5176" "Skips Frontend"

echo ""
echo -e "${BLUE}🌐 Starting Universal Gateway...${NC}"

# Start the gateway
nohup npm run gateway:dev > logs/gateway.log 2>&1 &
echo $! > logs/gateway.pid
echo -e "${GREEN}✅ Gateway started (PID: $(cat logs/gateway.pid))${NC}"

# Wait for gateway to be ready
wait_for_service "http://localhost:3000/health" "Gateway"

echo ""
echo -e "${GREEN}🎉 Full-Stack Development Environment is Ready!${NC}"
echo "================================================="
echo ""
echo -e "${BLUE}🌐 Universal Gateway Access:${NC}"
echo "  📄 Landing Page:     http://localhost:3000/"
echo "  ❤️  Health Check:     http://localhost:3000/health"
echo ""
echo -e "${BLUE}🎨 Frontend Apps (via Gateway):${NC}"
echo "  💰 FinClamp:         http://localhost:3000/finclamp"
echo "  🎮 Arcade Games:     http://localhost:3000/arcade"
echo "  💍 Engaged:          http://localhost:3000/engaged"
echo "  ⏭️  Skips:            http://localhost:3000/skips"
echo ""
echo -e "${BLUE}🔗 API Endpoints (via Gateway):${NC}"
echo "  💰 FinClamp API:     http://localhost:3000/api/finclamp/*"
echo "  🎮 Arcade API:       http://localhost:3000/api/arcade/*"
echo "  💍 Engaged API:      http://localhost:3000/api/engaged/*"
echo "  ⏭️  Skips API:        http://localhost:3000/api/skips/*"
echo ""
echo -e "${BLUE}🔧 Direct Access (for debugging):${NC}"
echo "  💰 FinClamp Frontend: http://localhost:5173"
echo "  🎮 Arcade Frontend:   http://localhost:5174"
echo "  💍 Engaged Frontend:  http://localhost:5175"
echo "  ⏭️  Skips Frontend:    http://localhost:5176"
echo "  💰 FinClamp API:      http://localhost:8001/api/v1/*"
echo "  🎮 Arcade API:        http://localhost:8002/api/v1/*"
echo "  💍 Engaged API:       http://localhost:8003/api/v1/*"
echo "  ⏭️  Skips API:         http://localhost:8004/api/v1/*"
echo ""
echo -e "${YELLOW}📋 Management Commands:${NC}"
echo "  📊 View logs:        tail -f logs/*.log"
echo "  🛑 Stop everything:  ./scripts/stop-fullstack.sh"
echo ""
echo -e "${GREEN}✨ Happy coding! All services are running with hot-reload! 🔥${NC}"
