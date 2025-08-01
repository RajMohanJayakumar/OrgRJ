package models

import "time"

// Game represents a game in the arcade
type Game struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Category   string `json:"category"`
	Difficulty string `json:"difficulty"`
	HighScore  int    `json:"highScore"`
}

// LeaderboardEntry represents a leaderboard entry
type LeaderboardEntry struct {
	Player string `json:"player"`
	Game   string `json:"game"`
	Score  int    `json:"score"`
	Date   string `json:"date"`
}

// ScoreSubmission represents a score submission request
type ScoreSubmission struct {
	Player string `json:"player" binding:"required"`
	Game   string `json:"game" binding:"required"`
	Score  int    `json:"score" binding:"required,gte=0"`
}

// ScoreResponse represents a score submission response
type ScoreResponse struct {
	Message       string           `json:"message"`
	Entry         LeaderboardEntry `json:"entry"`
	Rank          int              `json:"rank"`
	IsNewHighScore bool            `json:"isNewHighScore"`
	GameHighScore int              `json:"gameHighScore"`
}

// GamesResponse represents a games list response
type GamesResponse struct {
	Games   []Game                 `json:"games"`
	Total   int                    `json:"total"`
	Filters map[string]interface{} `json:"filters,omitempty"`
}

// LeaderboardResponse represents a leaderboard response
type LeaderboardResponse struct {
	Leaderboard []LeaderboardEntry     `json:"leaderboard"`
	Total       int                    `json:"total"`
	Filters     map[string]interface{} `json:"filters,omitempty"`
}

// GameDetailResponse represents a detailed game response
type GameDetailResponse struct {
	Game        Game                 `json:"game"`
	Leaderboard []LeaderboardEntry   `json:"leaderboard"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success   bool        `json:"success"`
	Message   string      `json:"message,omitempty"`
	Data      interface{} `json:"data,omitempty"`
	Error     string      `json:"error,omitempty"`
	Timestamp time.Time   `json:"timestamp"`
	RequestID string      `json:"requestId,omitempty"`
}

// HealthResponse represents a health check response
type HealthResponse struct {
	Status     string    `json:"status"`
	Service    string    `json:"service"`
	Version    string    `json:"version"`
	Timestamp  time.Time `json:"timestamp"`
	Uptime     string    `json:"uptime"`
	GamesCount int       `json:"gamesCount"`
}

// ServiceInfo represents service information
type ServiceInfo struct {
	Service     string   `json:"service"`
	Version     string   `json:"version"`
	Description string   `json:"description"`
	Endpoints   []string `json:"endpoints"`
}
