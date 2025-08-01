package main

import (
	"log"
	"skips-api/config"
	"skips-api/routes"
	"skips-api/server"
)

func main() {
	log.Println("Starting Skips API Server...")

	// Load configuration
	config.LoadConfig()

	// Initialize server
	server.InitServer()

	// Register routes
	routes.RegisterRoutes()

	// Start server
	server.StartServer()
}
