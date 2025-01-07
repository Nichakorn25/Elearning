package entity

import "gorm.io/gorm"

type CartStatus struct {
	gorm.Model
	StatusName   string `json:"status_name"` 
	Cart    []Cart `gorm:"foreignKey:CartStatusID" `        
}