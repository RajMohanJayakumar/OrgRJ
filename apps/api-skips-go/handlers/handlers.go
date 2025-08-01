package handlers

import (
	"skips-api/config"
	"skips-api/models"
	"skips-api/utils"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	startTime = time.Now()
	
	// Sample game data
	games = []models.Game{
		{ID: 1, Name: "Snake", Category: "classic", Difficulty: "easy", HighScore: 1250},
		{ID: 2, Name: "Tetris", Category: "puzzle", Difficulty: "medium", HighScore: 8900},
		{ID: 3, Name: "Pac-Man", Category: "arcade", Difficulty: "medium", HighScore: 15600},
		{ID: 4, Name: "Space Invaders", Category: "shooter", Difficulty: "hard", HighScore: 23400},
		{ID: 5, Name: "Pong", Category: "classic", Difficulty: "easy", HighScore: 21},
	}
	
	// Sample leaderboard data
	leaderboard = []models.LeaderboardEntry{
		{Player: "Player1", Game: "Snake", Score: 1250, Date: "2024-01-15"},
		{Player: "GameMaster", Game: "Tetris", Score: 8900, Date: "2024-01-14"},
		{Player: "ArcadeKing", Game: "Pac-Man", Score: 15600, Date: "2024-01-13"},
	}
)

// GetServiceInfo returns service information
func GetServiceInfo(c *gin.Context) {
	info := models.ServiceInfo{
		Service:     config.AppConfig.AppName,
		Version:     config.AppConfig.Version,
		Description: "Backend API for arcade games collection",
		Endpoints: []string{
			"GET /api/v1/ - Service info",
			"GET /api/v1/health - Health check",
			"GET /api/v1/games - List all games",
			"GET /api/v1/games/:id - Get specific game",
			"GET /api/v1/leaderboard - Get leaderboard",
			"POST /api/v1/score - Submit new score",
		},
	}

	utils.SendSuccessResponse(c, info, "Service information retrieved successfully")
}

// HealthCheck returns the health status of the service
func HealthCheck(c *gin.Context) {
	uptime := time.Since(startTime)
	
	health := models.HealthResponse{
		Status:     "healthy",
		Service:    config.AppConfig.AppName,
		Version:    config.AppConfig.Version,
		Timestamp:  time.Now(),
		Uptime:     uptime.String(),
		GamesCount: len(games),
	}

	utils.SendSuccessResponse(c, health, "Service is healthy")
}

// GetGames returns all games with optional filtering
func GetGames(c *gin.Context) {
	category := c.Query("category")
	difficulty := c.Query("difficulty")
	
	filteredGames := games
	filters := make(map[string]interface{})
	
	if category != "" {
		filters["category"] = category
		var filtered []models.Game
		for _, game := range filteredGames {
			if strings.EqualFold(game.Category, category) {
				filtered = append(filtered, game)
			}
		}
		filteredGames = filtered
	}
	
	if difficulty != "" {
		filters["difficulty"] = difficulty
		var filtered []models.Game
		for _, game := range filteredGames {
			if strings.EqualFold(game.Difficulty, difficulty) {
				filtered = append(filtered, game)
			}
		}
		filteredGames = filtered
	}

	response := models.GamesResponse{
		Games:   filteredGames,
		Total:   len(filteredGames),
		Filters: filters,
	}

	utils.SendSuccessResponse(c, response, "Games retrieved successfully")
}

// GetGameByID returns a specific game with its leaderboard
func GetGameByID(c *gin.Context) {
	idParam := c.Param("id")
	gameID, err := strconv.Atoi(idParam)
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid game ID", err.Error())
		return
	}

	var game *models.Game
	for _, g := range games {
		if g.ID == gameID {
			game = &g
			break
		}
	}

	if game == nil {
		utils.SendErrorResponse(c, http.StatusNotFound, "Game not found", "No game found with the specified ID")
		return
	}

	// Get game-specific leaderboard
	var gameLeaderboard []models.LeaderboardEntry
	for _, entry := range leaderboard {
		if entry.Game == game.Name {
			gameLeaderboard = append(gameLeaderboard, entry)
		}
	}

	// Sort by score (descending) and limit to top 10
	sort.Slice(gameLeaderboard, func(i, j int) bool {
		return gameLeaderboard[i].Score > gameLeaderboard[j].Score
	})
	if len(gameLeaderboard) > 10 {
		gameLeaderboard = gameLeaderboard[:10]
	}

	response := models.GameDetailResponse{
		Game:        *game,
		Leaderboard: gameLeaderboard,
	}

	utils.SendSuccessResponse(c, response, "Game details retrieved successfully")
}

// GetLeaderboard returns the leaderboard with optional filtering
func GetLeaderboard(c *gin.Context) {
	game := c.Query("game")
	limitParam := c.DefaultQuery("limit", "10")
	
	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit <= 0 {
		limit = 10
	}

	filteredLeaderboard := leaderboard
	filters := make(map[string]interface{})
	
	if game != "" {
		filters["game"] = game
		var filtered []models.LeaderboardEntry
		for _, entry := range filteredLeaderboard {
			if strings.EqualFold(entry.Game, game) {
				filtered = append(filtered, entry)
			}
		}
		filteredLeaderboard = filtered
	}

	// Sort by score (descending)
	sort.Slice(filteredLeaderboard, func(i, j int) bool {
		return filteredLeaderboard[i].Score > filteredLeaderboard[j].Score
	})

	// Apply limit
	if len(filteredLeaderboard) > limit {
		filteredLeaderboard = filteredLeaderboard[:limit]
	}

	filters["limit"] = limit

	response := models.LeaderboardResponse{
		Leaderboard: filteredLeaderboard,
		Total:       len(filteredLeaderboard),
		Filters:     filters,
	}

	utils.SendSuccessResponse(c, response, "Leaderboard retrieved successfully")
}

// SubmitScore handles score submission
func SubmitScore(c *gin.Context) {
	var req models.ScoreSubmission
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid request data", err.Error())
		return
	}

	// Validate game exists
	var gameExists *models.Game
	for _, g := range games {
		if strings.EqualFold(g.Name, req.Game) {
			gameExists = &g
			break
		}
	}

	if gameExists == nil {
		var gameNames []string
		for _, g := range games {
			gameNames = append(gameNames, g.Name)
		}
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid game", "Available games: "+strings.Join(gameNames, ", "))
		return
	}

	// Create new leaderboard entry
	newEntry := models.LeaderboardEntry{
		Player: strings.TrimSpace(req.Player),
		Game:   gameExists.Name,
		Score:  req.Score,
		Date:   time.Now().Format("2006-01-02"),
	}

	// Add to leaderboard
	leaderboard = append(leaderboard, newEntry)

	// Update high score if necessary
	isNewHighScore := req.Score > gameExists.HighScore
	if isNewHighScore {
		for i := range games {
			if games[i].ID == gameExists.ID {
				games[i].HighScore = req.Score
				break
			}
		}
	}

	// Calculate rank
	var gameLeaderboard []models.LeaderboardEntry
	for _, entry := range leaderboard {
		if entry.Game == gameExists.Name {
			gameLeaderboard = append(gameLeaderboard, entry)
		}
	}

	sort.Slice(gameLeaderboard, func(i, j int) bool {
		return gameLeaderboard[i].Score > gameLeaderboard[j].Score
	})

	rank := 1
	for i, entry := range gameLeaderboard {
		if entry.Player == newEntry.Player && entry.Score == newEntry.Score && entry.Date == newEntry.Date {
			rank = i + 1
			break
		}
	}

	response := models.ScoreResponse{
		Message:        "Score submitted successfully",
		Entry:          newEntry,
		Rank:           rank,
		IsNewHighScore: isNewHighScore,
		GameHighScore:  gameExists.HighScore,
	}

	utils.SendSuccessResponse(c, response, "Score submitted successfully")
}
