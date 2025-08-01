package server

import (
	"arcade-api/config"
	"arcade-api/middleware"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	Router *gin.Engine
	API    *gin.RouterGroup
)

func InitServer() {
	log.Println("Initializing server...")

	// Set Gin mode based on environment
	if config.AppConfig.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Create Gin router
	Router = gin.New()

	// Add middleware
	Router.Use(gin.Logger())
	Router.Use(gin.Recovery())
	Router.Use(middleware.RequestID())

	// CORS configuration
	Router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodPatch,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			"Accept",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
			"X-CSRF-Token",
			"X-Requested-With",
			"X-Request-ID",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Create API group
	API = Router.Group("/api/v1")

	log.Println("Server initialized successfully")
}

func StartServer() {
	address := ":" + config.AppConfig.Port
	log.Printf("Starting %s on port %s", config.AppConfig.AppName, config.AppConfig.Port)
	log.Printf("Server running at http://localhost%s", address)

	if err := Router.Run(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
