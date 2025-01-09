package entity

import (
	"gorm.io/gorm"
)
type ConflictType struct {
	gorm.Model
	Name          string         `json:"Name"`
	TimeConflicts []TimeConflict `gorm:"foreignKey:ConflictTypeID"`
}
