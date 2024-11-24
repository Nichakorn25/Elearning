package entity

import (
	"gorm.io/gorm"
)
type Module struct {
	gorm.Model
	ModuleName  string `json:"ModuleName"`

	Permission []Permission `gorm:"foreignKey:ModuleID"`
}