package entity

import (
	"gorm.io/gorm"
)

type Major struct {
	gorm.Model
	MajorName  string `json:"MajorName"`

	User []User `gorm:"foreignKey:MajorID"`

	DepartmentID uint 		`json:"DepartmentID"`
	Department   Department 	`gorm:"foreignKey:DepartmentID"`

}