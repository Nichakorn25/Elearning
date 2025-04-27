package entity

import (
	"gorm.io/gorm"
)
type PaymentStatus struct {
	gorm.Model
	StatusName  string `json:"StatusName"`
	TransactionLog []TransactionLog `gorm:"foreignKey:StatusID"`
}