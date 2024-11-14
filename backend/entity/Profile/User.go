package Profile

import (
	"gorm.io/gorm"
)
type User struct {
	gorm.Model
	Username  string `json:"Username"`
	Password  string `json:"Password"`
	FullName  string `json:"FullName"`
	Email  string `json:"Email"`
	Phone  string `json:"CourseName"`
	

	DepartmentID uint `json:"DepartmentID"`
	Department   Department `gorm:"foreignKey:DepartmentID"`

	MajorID uint `json:"MajorID"`
	Major   Major `gorm:"foreignKey:MajorID"`

	RoleID uint `json:"RoleID"`
	Role   Role `gorm:"foreignKey:RoleID"`

	
}