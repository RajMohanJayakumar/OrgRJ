package main

import (
	"arcade-api/config"
	"arcade-api/routes"
	"arcade-api/server"
	"log"
)

func main() {
	log.Println("Starting Arcade API Server...")

	// Load configuration
	config.LoadConfig()

	// Initialize server
	server.InitServer()

	// Register routes
	routes.RegisterRoutes()

	// Start server
	server.StartServer()
}
