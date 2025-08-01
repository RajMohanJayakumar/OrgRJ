package main

import (
	"finclamp-api/config"
	"finclamp-api/routes"
	"finclamp-api/server"
	"log"
)

func main() {
	log.Println("Starting FinClamp API Server...")
	
	// Load configuration
	config.LoadConfig()
	
	// Initialize server
	server.InitServer()
	
	// Register routes
	routes.RegisterRoutes()
	
	// Start server
	server.StartServer()
}
