package entity

import (
	"gorm.io/gorm"
)

type RequestChangeRole struct {
	gorm.Model
	UserID     uint   `json:"userID"`                         // เชื่อมโยงกับตาราง User
	User       User   `gorm:"foreignKey:UserID"`              // Foreign key สำหรับดึงข้อมูล User
	Reason     string `json:"reason"`                         // เหตุผลในการขอเปลี่ยน Role
	IDCard     string `json:"idCard"`                         // Path ของไฟล์บัตรประชาชนที่อัปโหลด
	Status     string `json:"status"` // สถานะของคำขอ (Pending, Approved, Rejected)
}
