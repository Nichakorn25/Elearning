package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string `json:"Username"`
	Password  string `json:"Password"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Email     string `json:"Email"`
	Phone     string `json:"Phone"`

	ProfilePicture []ProfilePicture `gorm:"foreignKey:UserID"`
	Annoucement    []Announcement   `gorm:"foreignKey:UserID"`
	Log            []Log            `gorm:"foreignKey:UserID"`
	Review         []Review         `gorm:"foreignKey:UserID"`
	Purchase       []Purchase       `gorm:"foreignKey:UserID"`
	Payment []Payment `gorm:"foreignKey:UserID"`
	Submission    []Submission    `gorm:"foreignKey:UserID"`
	Course        []Course        `gorm:"foreignKey:UserID"`
	StudentAnswer []StudentAnswer `gorm:"foreignKey:UserID"`
	Seller        []Seller        `gorm:"foreignKey:UserID"`
	Cart          []Cart          `gorm:"foreignKey:UserID" `

	DepartmentID uint       `json:"DepartmentID"`
	Department   Department `gorm:"foreignKey:DepartmentID"`

	MajorID uint  `json:"MajorID"`
	Major   Major `gorm:"foreignKey:MajorID"`

	RoleID uint `json:"RoleID"`
	Role   Role `gorm:"foreignKey:RoleID"`
}
