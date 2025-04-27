package entity

import (
	"gorm.io/gorm"
)

type RequestChangeRole struct {
	gorm.Model
	Reason     string `json:"reason" valid:"required~Reason is required"`                
	IDCard     string `json:"idCard" valid:"required~IDCard is required, url~IDCard must be a valid URL"`                 
	Status     string `json:"status" valid:"required~Status is required"`						
	UserID     uint   `json:"userID" valid:"required~UserID is required"`                         
	User       User   `gorm:"foreignKey:UserID"`             
	
}