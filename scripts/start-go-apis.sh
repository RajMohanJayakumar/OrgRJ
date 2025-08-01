#!/bin/bash

# Universal Gateway System Startup Script
# This script starts all Go APIs and the gateway in the correct order

set -e

echo "🚀 Starting Universal Gateway System..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Array of API services with their directories and ports
apis=(
    "finclamp:apps/api-finclamp-go:8001"
    "arcade:apps/api-arcade-go:8002"
    "engaged:apps/api-engaged-go:8003"
    "skips:apps/api-skips-go:8004"
)

# Function to start an API service
start_api() {
    local name=$1
    local dir=$2
    local port=$3
    
    echo "Starting $name API on port $port..."
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo "Error: Directory $dir does not exist"
        return 1
    fi
    
    # Start the service in background
    cd "$dir"
    go mod tidy > /dev/null 2>&1
    nohup go run main.go > "../../../logs/${name}-api.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../../../logs/${name}-api.pid"
    cd - > /dev/null
    
    echo "$name API started with PID $pid"
}

# Create logs directory
mkdir -p logs

# Start each API service
for api_info in "${apis[@]}"; do
    IFS=':' read -r name dir port <<< "$api_info"
    start_api "$name" "$dir" "$port"
    sleep 2  # Give each service time to start
done

echo ""
echo "All Go API services started!"
echo ""
echo "API Services:"
for api_info in "${apis[@]}"; do
    IFS=':' read -r name dir port <<< "$api_info"
    echo "  $name API: http://localhost:$port"
done

echo ""
echo "Log files are in the logs/ directory"
echo "To stop all services, run: ./scripts/stop-go-apis.sh"
