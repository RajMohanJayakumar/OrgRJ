package utils

import (
	"engaged-api/models"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// SendSuccessResponse sends a successful API response
func SendSuccessResponse(c *gin.Context, data interface{}, message string) {
	requestID, _ := c.Get("RequestID")

	response := models.APIResponse{
		Success:   true,
		Message:   message,
		Data:      data,
		Timestamp: time.Now(),
		RequestID: requestID.(string),
	}

	c.JSON(http.StatusOK, response)
}

// SendErrorResponse sends an error API response
func SendErrorResponse(c *gin.Context, statusCode int, message, error string) {
	requestID, _ := c.Get("RequestID")

	response := models.APIResponse{
		Success:   false,
		Message:   message,
		Error:     error,
		Timestamp: time.Now(),
		RequestID: requestID.(string),
	}

	c.JSON(statusCode, response)
}

// RoundToTwoDecimals rounds a float64 to two decimal places
func RoundToTwoDecimals(value float64) float64 {
	return math.Round(value*100) / 100
}
