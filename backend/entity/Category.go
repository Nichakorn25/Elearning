package entity

import (
	"gorm.io/gorm"
)
type Category struct {
	gorm.Model
	CategoryID int32 `json:"CategoryID"`
	CategoryName  string `json:"CategoryName"`

	Course []Course `gorm:"foreignKey:CategoryID"`
}