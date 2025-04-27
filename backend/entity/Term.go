package entity

import (
	"gorm.io/gorm"
)
type Term struct {
	gorm.Model
	TermName          string              `json:"Name"`
	Sheet             []Sheet             `gorm:"foreignKey:TermID"`
}