package Profile

import (
	"elearning/backend/entity/Admin"
	"gorm.io/gorm"
)
type User struct {
	gorm.Model
	Username  string `json:"Username"`
	Password  string `json:"Password"`
	FullName  string `json:"FullName"`
	Email  string `json:"Email"`
	Phone  string `json:"CourseName"`
	
	ProfilePicture []ProfilePicture `gorm:"foreignKey:UserID"`
	Annoucement []Annoucement `gorm:"foreignKey:UserID"`
	Log []Log `gorm:"foreignKey:UserID"`
	Review []Review `gorm:"foreignKey:UserID"`
	Purchase []Purchase `gorm:"foreignKey:UserID"`
	Payment []Payment `gorm:"foreignKey:UserID"`
	CartItem []CartItem `gorm:"foreignKey:UserID"`
	Submission []Submissiion `gorm:"foreignKey:UserID"`
	Course []Course `gorm:"foreignKey:UserID"`
	StudentAnswer []StudentAnswer `gorm:"foreignKey:UserID"`


	DepartmentID uint `json:"DepartmentID"`
	Department   Department `gorm:"foreignKey:DepartmentID"`

	MajorID uint `json:"MajorID"`
	Major   Major `gorm:"foreignKey:MajorID"`

	RoleID uint `json:"RoleID"`
	Role   Role `gorm:"foreignKey:RoleID"`

	
}