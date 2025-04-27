package entity
import (
	"gorm.io/gorm"
)
type TeacherAppointment struct {
	gorm.Model
	Title              string `json:"title" gorm:"not null" valid:"required~Title is required"`
	AppointmentDuration string `json:"appointment_duration" gorm:"not null" valid:"required~AppointmentDuration is required"`
	Location           string `json:"location" valid:"required~Location is required"`
	Description        string `json:"description" valid:"required~Description is required"`

	UserID      uint      `json:"UserID" valid:"required~UserID is required"`
	User        User      `gorm:"foreignKey:UserID"`

	DayofWeekID uint      `json:"DayofWeekID" valid:"required~DayofWeekID is required"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`
}