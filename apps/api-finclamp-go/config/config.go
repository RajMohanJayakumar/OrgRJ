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
		Port:        getEnv("PORT", "8001"),
		Environment: getEnv("ENVIRONMENT", "development"),
		AppName:     "FinClamp API",
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
