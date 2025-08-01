package routes

import (
	"engaged-api/handlers"
	"engaged-api/server"
	"log"
)

// RegisterRoutes registers all API routes
func RegisterRoutes() {
	log.Println("Registering routes...")
	
	// Service info and health routes
	server.API.GET("/", handlers.GetServiceInfo)
	server.API.GET("/health", handlers.HealthCheck)
	
	// Game routes
	server.API.GET("/games", handlers.GetGames)
	server.API.GET("/games/:id", handlers.GetGameByID)
	
	// Leaderboard and score routes
	server.API.GET("/leaderboard", handlers.GetLeaderboard)
	server.API.POST("/score", handlers.SubmitScore)
	
	log.Println("Routes registered successfully")
}
