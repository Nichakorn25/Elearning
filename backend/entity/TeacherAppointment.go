package entity
import (
	"gorm.io/gorm"
)
type TeacherAppointment struct{
	gorm.Model
	Title            string     `json:"title" gorm:"not null"`  // ชื่อการตั้งค่า (Add Title)
    AppointmentDuration string      `json:"appointment_duration" gorm:"not null"` // ระยะเวลาการนัดหมาย (เช่น 1 ชั่วโมง)
    // BufferTime       int        `json:"buffer_time"`           // เวลา Buffer ระหว่างการนัดหมาย (นาที)
    // MaxBookings      int        `json:"max_bookings"`          // จำนวนการนัดหมายสูงสุด
    Location         string     `json:"location"`              // สถานที่นัดหมาย
    Description      string     `json:"description"`           // คำอธิบายเพิ่มเติม
	
	StudentBooking []StudentBooking `gorm:"foreignKey:TeacherAppointmentID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	DayofWeekID uint `json:"DayofWeekID"`
	DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`

	// AvailabilityID uint `json:"AvailabilityID"`
	// Availability   Availability `gorm:"foreignKey:AvailabilityID"`
}