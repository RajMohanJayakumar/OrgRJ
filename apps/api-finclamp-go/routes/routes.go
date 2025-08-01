package routes

import (
	"finclamp-api/handlers"
	"finclamp-api/server"
	"log"
)

// RegisterRoutes registers all API routes
func RegisterRoutes() {
	log.Println("Registering routes...")
	
	// Service info and health routes
	server.API.GET("/", handlers.GetServiceInfo)
	server.API.GET("/health", handlers.HealthCheck)
	
	// Calculation routes
	calc := server.API.Group("/calculate")
	{
		calc.POST("/loan", handlers.CalculateLoan)
		calc.POST("/savings", handlers.CalculateSavings)
		calc.POST("/investment", handlers.CalculateInvestment)
	}
	
	log.Println("Routes registered successfully")
}
