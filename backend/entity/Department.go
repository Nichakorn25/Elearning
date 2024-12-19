package entity

import (
	"gorm.io/gorm"
)
type Department struct {
	gorm.Model
	DepartmentName  string `json:"DepartmentName"`

	User []User `gorm:"foreignKey:DepartmentID"`

	Major []Major `gorm:"foreignKey:DepartmentID"`

}