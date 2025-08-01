package main

import (
	"engaged-api/config"
	"engaged-api/routes"
	"engaged-api/server"
	"log"
)

func main() {
	log.Println("Starting Engaged API Server...")

	// Load configuration
	config.LoadConfig()

	// Initialize server
	server.InitServer()

	// Register routes
	routes.RegisterRoutes()

	// Start server
	server.StartServer()
}
