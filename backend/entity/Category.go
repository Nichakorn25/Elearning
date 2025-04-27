package entity

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	CategoryName string `json:"CategoryName"`

	Course []Course `gorm:"foreignKey:CategoryID"`
}