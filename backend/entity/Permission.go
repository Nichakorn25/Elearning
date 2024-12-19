package entity

import (
	"gorm.io/gorm"
)
type Permission struct {
	gorm.Model
	CanCreate  bool `json:"CanCreate"`
	CanRead	   bool `json:"CanRead"`
	CanUpdate  bool `json:"CanUpdate"`
	CanDelete  bool `json:"CanDelete"`

	ModuleID uint `json:"ModuleID"`
	Module   Module `gorm:"foreignKey:ModuleID"`

	RoleID uint `json:"RoleID"`
	Role   Role `gorm:"foreignKey:RoleID"`
}