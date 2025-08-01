#!/bin/bash

# Script to stop all Go API services

echo "Stopping Go API services..."

# Array of API service names
apis=("finclamp" "arcade" "engaged" "skips")

# Function to stop an API service
stop_api() {
    local name=$1
    local pid_file="logs/${name}-api.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping $name API (PID: $pid)..."
            kill "$pid"
            rm "$pid_file"
            echo "$name API stopped"
        else
            echo "$name API was not running"
            rm "$pid_file"
        fi
    else
        echo "No PID file found for $name API"
    fi
}

# Stop each API service
for name in "${apis[@]}"; do
    stop_api "$name"
done

echo ""
echo "All Go API services stopped!"
