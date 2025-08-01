package handlers

import (
	"finclamp-api/config"
	"finclamp-api/models"
	"finclamp-api/utils"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var startTime = time.Now()

// GetServiceInfo returns service information
func GetServiceInfo(c *gin.Context) {
	info := models.ServiceInfo{
		Service:     config.AppConfig.AppName,
		Version:     config.AppConfig.Version,
		Description: "Financial calculator backend API",
		Endpoints: []string{
			"GET /api/v1/ - Service info",
			"GET /api/v1/health - Health check",
			"POST /api/v1/calculate/loan - Loan calculations",
			"POST /api/v1/calculate/savings - Savings calculations",
			"POST /api/v1/calculate/investment - Investment calculations",
		},
	}

	utils.SendSuccessResponse(c, info, "Service information retrieved successfully")
}

// HealthCheck returns the health status of the service
func HealthCheck(c *gin.Context) {
	uptime := time.Since(startTime)
	
	health := models.HealthResponse{
		Status:    "healthy",
		Service:   config.AppConfig.AppName,
		Version:   config.AppConfig.Version,
		Timestamp: time.Now(),
		Uptime:    uptime.String(),
	}

	utils.SendSuccessResponse(c, health, "Service is healthy")
}

// CalculateLoan handles loan calculation requests
func CalculateLoan(c *gin.Context) {
	var req models.LoanCalculationRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid request data", err.Error())
		return
	}

	// Set default type if not provided
	if req.Type == "" {
		req.Type = "monthly"
	}

	// Calculate loan
	monthlyRate := req.Rate / 100 / 12
	numPayments := float64(req.Term * 12)
	
	monthlyPayment := req.Principal * (monthlyRate * math.Pow(1+monthlyRate, numPayments)) / 
		(math.Pow(1+monthlyRate, numPayments) - 1)
	
	totalAmount := monthlyPayment * numPayments
	totalInterest := totalAmount - req.Principal

	response := models.LoanCalculationResponse{
		MonthlyPayment: utils.RoundToTwoDecimals(monthlyPayment),
		TotalAmount:    utils.RoundToTwoDecimals(totalAmount),
		TotalInterest:  utils.RoundToTwoDecimals(totalInterest),
		NumPayments:    int(numPayments),
	}

	utils.SendSuccessResponse(c, response, "Loan calculation completed successfully")
}

// CalculateSavings handles savings calculation requests
func CalculateSavings(c *gin.Context) {
	var req models.SavingsCalculationRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid request data", err.Error())
		return
	}

	// Calculate savings
	monthlyRate := req.Rate / 100 / 12
	numMonths := float64(req.Term * 12)
	
	// Future value with compound interest
	futureValue := req.Principal * math.Pow(1+monthlyRate, numMonths)
	
	// Future value of monthly contributions (annuity)
	var contributionValue float64
	if req.MonthlyContribution > 0 && monthlyRate > 0 {
		contributionValue = req.MonthlyContribution * 
			((math.Pow(1+monthlyRate, numMonths) - 1) / monthlyRate)
	}

	totalValue := futureValue + contributionValue
	totalContributions := req.Principal + (req.MonthlyContribution * numMonths)
	totalInterest := totalValue - totalContributions

	response := models.SavingsCalculationResponse{
		FinalAmount:        utils.RoundToTwoDecimals(totalValue),
		TotalContributions: utils.RoundToTwoDecimals(totalContributions),
		TotalInterest:      utils.RoundToTwoDecimals(totalInterest),
		NumMonths:          int(numMonths),
	}

	utils.SendSuccessResponse(c, response, "Savings calculation completed successfully")
}

// CalculateInvestment handles investment calculation requests
func CalculateInvestment(c *gin.Context) {
	var req models.InvestmentCalculationRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid request data", err.Error())
		return
	}

	// Set default risk level if not provided
	if req.RiskLevel == "" {
		req.RiskLevel = "medium"
	}

	// Calculate investment
	annualReturn := req.ExpectedReturn / 100
	futureValue := req.Amount * math.Pow(1+annualReturn, float64(req.Term))
	totalGain := futureValue - req.Amount
	annualizedReturn := math.Pow(futureValue/req.Amount, 1/float64(req.Term)) - 1

	// Risk adjustment factors
	riskFactors := map[string]float64{
		"low":    0.8,
		"medium": 1.0,
		"high":   1.2,
	}

	riskFactor, exists := riskFactors[req.RiskLevel]
	if !exists {
		riskFactor = 1.0
	}

	adjustedGain := totalGain * riskFactor
	adjustedFutureValue := req.Amount + adjustedGain

	response := models.InvestmentCalculationResponse{
		ProjectedValue:   utils.RoundToTwoDecimals(futureValue),
		AdjustedValue:    utils.RoundToTwoDecimals(adjustedFutureValue),
		TotalGain:        utils.RoundToTwoDecimals(totalGain),
		AdjustedGain:     utils.RoundToTwoDecimals(adjustedGain),
		AnnualizedReturn: utils.RoundToTwoDecimals(annualizedReturn * 100), // Convert to percentage
	}

	utils.SendSuccessResponse(c, response, "Investment calculation completed successfully")
}
