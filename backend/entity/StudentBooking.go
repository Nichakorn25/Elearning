package entity

import (
	"gorm.io/gorm"
)

type StudentBooking struct {
	gorm.Model

	UserID uint `json:"userId" valid:"required~UserID is required"`
	User   User `gorm:"foreignKey:UserID"`

	DayofWeekID uint      `json:"dayOfWeekId" valid:"required~DayOfWeekID is required"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`

	TeacherAppointmentID uint               `json:"teacherAppointmentId" valid:"required~TeacherAppointmentID is required"`
	TeacherAppointment   TeacherAppointment `gorm:"foreignKey:TeacherAppointmentID"`
}