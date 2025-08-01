#!/bin/bash

# Script to create Go API services for the monorepo
# This script creates the basic structure for each API service

set -e

# Define the APIs to create (name:port)
apis="arcade:8002 engaged:8003 skips:8004"

# Base directory
BASE_DIR="apps"

# Function to create API structure
create_api() {
    local name=$1
    local port=$2
    local api_dir="${BASE_DIR}/api-${name}-go"
    
    echo "Creating ${name} API on port ${port}..."
    
    # Create directories
    mkdir -p "${api_dir}"/{config,server,middleware,models,handlers,utils,routes}
    
    # Create go.mod
    cat > "${api_dir}/go.mod" << EOF
module ${name}-api

go 1.21

require (
	github.com/gin-contrib/cors v1.4.0
	github.com/gin-gonic/gin v1.9.1
	github.com/google/uuid v1.3.0
)

require (
	github.com/bytedance/sonic v1.9.1 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311 // indirect
	github.com/gabriel-vasile/mimetype v1.4.2 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.14.0 // indirect
	github.com/goccy/go-json v0.10.2 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.4 // indirect
	github.com/leodido/go-urn v1.2.4 // indirect
	github.com/mattn/go-isatty v0.0.19 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/pelletier/go-toml/v2 v2.0.8 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.11 // indirect
	golang.org/x/arch v0.3.0 // indirect
	golang.org/x/crypto v0.9.0 // indirect
	golang.org/x/net v0.10.0 // indirect
	golang.org/x/sys v0.8.0 // indirect
	golang.org/x/text v0.9.0 // indirect
	google.golang.org/protobuf v1.30.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
EOF

    # Create main.go
    cat > "${api_dir}/main.go" << EOF
package main

import (
	"${name}-api/config"
	"${name}-api/routes"
	"${name}-api/server"
	"log"
)

func main() {
	log.Println("Starting $(echo ${name} | sed 's/./\U&/') API Server...")
	
	// Load configuration
	config.LoadConfig()
	
	// Initialize server
	server.InitServer()
	
	// Register routes
	routes.RegisterRoutes()
	
	// Start server
	server.StartServer()
}
EOF

    # Create config/config.go
    cat > "${api_dir}/config/config.go" << EOF
package config

import (
	"log"
	"os"
)

type Config struct {
	Port        string
	Environment string
	AppName     string
	Version     string
}

var AppConfig Config

func LoadConfig() {
	log.Println("Loading configuration...")
	
	AppConfig = Config{
		Port:        getEnv("PORT", "${port}"),
		Environment: getEnv("ENVIRONMENT", "development"),
		AppName:     "${name^} API",
		Version:     "1.0.0",
	}
	
	log.Printf("Configuration loaded: %+v", AppConfig)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
EOF

    # Copy common files from finclamp API
    cp "${BASE_DIR}/api-finclamp-go/server/server.go" "${api_dir}/server/"
    cp "${BASE_DIR}/api-finclamp-go/middleware/middleware.go" "${api_dir}/middleware/"
    cp "${BASE_DIR}/api-finclamp-go/utils/response.go" "${api_dir}/utils/"
    
    # Update import paths in copied files
    sed -i.bak "s/finclamp-api/${name}-api/g" "${api_dir}/server/server.go" && rm "${api_dir}/server/server.go.bak"
    sed -i.bak "s/finclamp-api/${name}-api/g" "${api_dir}/utils/response.go" && rm "${api_dir}/utils/response.go.bak"
    
    echo "Created ${name} API structure successfully"
}

# Create each API
for api_info in $apis; do
    IFS=':' read -r api_name port <<< "$api_info"
    create_api "$api_name" "$port"
done

echo "All Go APIs created successfully!"
echo ""
echo "To run the APIs:"
for api_info in $apis; do
    IFS=':' read -r api_name port <<< "$api_info"
    echo "  cd apps/api-${api_name}-go && go run main.go"
done
