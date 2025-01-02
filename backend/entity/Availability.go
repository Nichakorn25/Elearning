package entity

import (
	"gorm.io/gorm"
	"time"
)

type Availability struct{
	gorm.Model
	AppointmentSettingsID uint      `json:"appointment_settings_id" gorm:"not null"`
    Day                   string    `json:"day" gorm:"not null"` // วันในสัปดาห์ (เช่น Monday, Tuesday)
    StartTime             time.Time `json:"start_time"`          // เวลาเริ่มต้น
    EndTime               time.Time `json:"end_time"`            // เวลาสิ้นสุด
    IsAvailable           bool      `json:"is_available"`        // สถานะ Available หรือ Unavailable

	TeacherAppointment []TeacherAppointment `gorm:"foreignKey:AvailabilityID"`
}