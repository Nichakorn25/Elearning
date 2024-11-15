package Admin

import (
	"elearing/entity/Profile"

	"gorm.io/gorm"
)
type Role struct {
	gorm.Model
	RoleName  string `json:"RoleName"`

	Permission []Permission `gorm:"foreignKey:RoleID"`
	User []Profile.User `gorm:"foreignKey:RoleID"`
}