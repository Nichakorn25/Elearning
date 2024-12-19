package entity

import (

	"gorm.io/gorm"
)
type Role struct {
	gorm.Model
	RoleName  string `json:"RoleName"`

	Permission []Permission `gorm:"foreignKey:RoleID"`
	User []User `gorm:"foreignKey:RoleID"`
}