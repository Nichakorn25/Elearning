package entity

import (
	"gorm.io/gorm"
)
type DayofWeek struct {
	gorm.Model
	DayName  string `json:"DayName"`

	// Course []Course `gorm:"foreignKey:DayofWeekID"`
	TeacherAppointment []TeacherAppointment `gorm:"foreignKey:DayofWeekID"`
	StudentBooking []StudentBooking `gorm:"foreignKey:DayofWeekID"`
	ClassSchedule []ClassSchedule `gorm:"foreignKey:DayofWeekID"`
}