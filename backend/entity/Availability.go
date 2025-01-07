package entity

import (
	"time"

	"gorm.io/gorm"
)

type Availability struct {
	gorm.Model
	Day         string    `json:"day" gorm:"not null"` // วันในสัปดาห์ (เช่น Monday, Tuesday)
	StartTime   time.Time `json:"start_time"`          // เวลาเริ่มต้น
	EndTime     time.Time `json:"end_time"`            // เวลาสิ้นสุด
	IsAvailable bool      `json:"is_available"`        // สถานะ Available หรือ Unavailable

	// ความสัมพันธ์กับ TeacherAppointment
	TeacherAppointments []TeacherAppointment `gorm:"foreignKey:AvailabilityID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`
}
