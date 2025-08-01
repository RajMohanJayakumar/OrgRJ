package models

import "time"

// LoanCalculationRequest represents a loan calculation request
type LoanCalculationRequest struct {
	Principal float64 `json:"principal" binding:"required,gt=0"`
	Rate      float64 `json:"rate" binding:"required,gt=0"`
	Term      int     `json:"term" binding:"required,gt=0"`
	Type      string  `json:"type"`
}

// LoanCalculationResponse represents a loan calculation response
type LoanCalculationResponse struct {
	MonthlyPayment float64 `json:"monthlyPayment"`
	TotalAmount    float64 `json:"totalAmount"`
	TotalInterest  float64 `json:"totalInterest"`
	NumPayments    int     `json:"numPayments"`
}

// SavingsCalculationRequest represents a savings calculation request
type SavingsCalculationRequest struct {
	Principal            float64 `json:"principal" binding:"required,gt=0"`
	Rate                 float64 `json:"rate" binding:"required,gt=0"`
	Term                 int     `json:"term" binding:"required,gt=0"`
	MonthlyContribution  float64 `json:"monthlyContribution"`
}

// SavingsCalculationResponse represents a savings calculation response
type SavingsCalculationResponse struct {
	FinalAmount        float64 `json:"finalAmount"`
	TotalContributions float64 `json:"totalContributions"`
	TotalInterest      float64 `json:"totalInterest"`
	NumMonths          int     `json:"numMonths"`
}

// InvestmentCalculationRequest represents an investment calculation request
type InvestmentCalculationRequest struct {
	Amount         float64 `json:"amount" binding:"required,gt=0"`
	ExpectedReturn float64 `json:"expectedReturn" binding:"required,gt=0"`
	Term           int     `json:"term" binding:"required,gt=0"`
	RiskLevel      string  `json:"riskLevel"`
}

// InvestmentCalculationResponse represents an investment calculation response
type InvestmentCalculationResponse struct {
	ProjectedValue    float64 `json:"projectedValue"`
	AdjustedValue     float64 `json:"adjustedValue"`
	TotalGain         float64 `json:"totalGain"`
	AdjustedGain      float64 `json:"adjustedGain"`
	AnnualizedReturn  float64 `json:"annualizedReturn"`
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
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Version   string    `json:"version"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
}

// ServiceInfo represents service information
type ServiceInfo struct {
	Service     string   `json:"service"`
	Version     string   `json:"version"`
	Description string   `json:"description"`
	Endpoints   []string `json:"endpoints"`
}
