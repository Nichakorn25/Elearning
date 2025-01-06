package entity

import (
	
	"gorm.io/gorm"
)
type RequestChangeRole struct {
	gorm.Model
    Username   string    `json:"username"`
    Fullname   string    `json:"fullname"`
    Email      string    `json:"email"`
    Phone      string    `json:"phone"`
    Department string    `json:"department"`
    Major      string    `json:"major"`
    Reason     string    `json:"reason"`
    IDCard     string    `json:"idCard"`  // Path to the uploaded ID card image
}