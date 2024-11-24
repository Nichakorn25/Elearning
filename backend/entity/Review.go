package entity

import (
	"gorm.io/gorm"
	"time"
)

type Review struct {
	gorm.Model
	Comment    string    `json:"Comment"`
	Rating     uint      `json:"Rating"`
	ReviewDate time.Time `json:"ReviewDate"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	SheetID uint  `json:"SheetID"`
	Sheet   Sheet `gorm:"foreignKey:SheetID"`
}
