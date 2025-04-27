package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string `json:"Username" valid:"required~Username is required"`
	Password  string `json:"Password" valid:"required~Password is required"`
	FirstName string `json:"FirstName" valid:"required~FirstName is required"`
	LastName  string `json:"LastName" valid:"required~LastName is required"`
	Email     string `json:"Email" valid:"required~Email is required, email~Email is invalid"`
	Phone     string `json:"Phone" valid:"required~Phone is required, stringlength(10|10)"`
	Status    string `json:"Status" valid:"required~Status is required"`

	ProfilePicture     []ProfilePicture     `gorm:"foreignKey:UserID"`
	Announcement       []Announcement       `gorm:"foreignKey:UserID"`
	Log                []Log                `gorm:"foreignKey:UserID"`
	Review             []Review             `gorm:"foreignKey:UserID"`
	Purchase           []Purchase           `gorm:"foreignKey:UserID"`
	Payment            []Payment            `gorm:"foreignKey:UserID"`
	Submission         []Submission         `gorm:"foreignKey:UserID"`
	Course             []Course             `gorm:"foreignKey:UserID"`
	StudentAnswer      []StudentAnswer      `gorm:"foreignKey:UserID"`
	Seller             []Seller             `gorm:"foreignKey:UserID"`
	Cart               []Cart               `gorm:"foreignKey:UserID" `
	TeacherAppointment []TeacherAppointment `gorm:"foreignKey:UserID"`
	StudentBooking     []StudentBooking     `gorm:"foreignKey:UserID"`
	RequestChangeRole  []RequestChangeRole  `gorm:"foreignKey:UserID"`
	ClassSchedule  []ClassSchedule  `gorm:"foreignKey:UserID"`
	Task  []Task  `gorm:"foreignKey:UserID"`

	DepartmentID uint       `json:"DepartmentID" valid:"required~DepartmentID is required"`
	Department   Department `gorm:"foreignKey:DepartmentID"`

	MajorID uint  `json:"MajorID" valid:"required~MajorID is required"`
	Major   Major `gorm:"foreignKey:MajorID"`

	RoleID uint `json:"RoleID" valid:"required~RoleID is required"`
	Role   Role `gorm:"foreignKey:RoleID"`
}