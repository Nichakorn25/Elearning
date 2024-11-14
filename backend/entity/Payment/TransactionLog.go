package Payment

import (
	"time"
	"gorm.io/gorm"
)
type TransactionLog struct {
	gorm.Model
	TransactionDate	time.Time `json:"CourseDate"`

	StatusID uint `json:"StatusID"`
	PaymentStatus   PaymentStatus `gorm:"foreignKey:StatusID"`

	PaymentID uint `json:"PaymentID"`
	Payment   Payment `gorm:"foreignKey:PaymentID"`

	
}