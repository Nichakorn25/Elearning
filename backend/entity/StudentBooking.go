package entity

import (
	"gorm.io/gorm"
)
type StudentBooking struct {
	gorm.Model

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	TeacherAppointmentID uint `json:"TeacherAppointmentID"`
	TeacherAppointment   TeacherAppointment `gorm:"foreignKey:TeacherAppointmentID"`
}