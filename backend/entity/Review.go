package entity

import (
	"gorm.io/gorm"
	"time"
)


type Review struct {
	gorm.Model
	Comment    string    `json:"Comment" valid:"required~Comment is required"`
	Rating     float32      `json:"Rating" valid:"required~Rating is required, range(0|5)~Rating must be between 0 and 5"`	
	ReviewDate time.Time `json:"ReviewDate" valid:"required~ReviewDate is required"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	SheetID uint  `json:"SheetID"`
	Sheet   Sheet `gorm:"foreignKey:SheetID"`
}