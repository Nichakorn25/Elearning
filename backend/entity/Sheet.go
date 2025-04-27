package entity

import (
	"gorm.io/gorm"
)

type Sheet struct {
	gorm.Model
	Title         string  `json:"Title" valid:"required~Title is required"`                                                                                                      // ต้องไม่ว่าง
	Description   string  `json:"Description" valid:"required~Description is required"`                                                                                        // ต้องไม่ว่าง
	FilePath string `json:"FilePath" valid:"required~FilePath is required, matches(\\.pdf$)~FilePath must have a .pdf extension"`                           // ต้องเป็น URL
	Price         float32 `json:"Price" valid:"required~Price is required,float~Price must be a valid float,range(0|10000)~Price must be between 0 and 10000"` // ราคา >= 0 และ <= 10000
	Rating        float32 `json:"Rating" valid:"float~Rating must be a valid float,range(0|5)~Rating must be between 0 and 5"`                                           // เรตติ้ง >= 0 และ <= 5
	PurchaseCount uint    `json:"PurchaseCount"`
	Year          uint    `json:"Year" valid:"required~Year is required"`

	Review   []Review   `gorm:"foreignKey:SheetID"`
	CartItem []CartItem `gorm:"foreignKey:SheetID"`

	TermID uint   `json:"TermID" valid:"-"` // ไม่ตรวจสอบ FK
	Term   Term   `gorm:"foreignKey:TermID"`

	SellerID uint   `json:"SellerID" valid:"-"` // ไม่ตรวจสอบ FK
	Seller   Seller `gorm:"foreignKey:SellerID"`

	CourseID uint   `json:"CourseID" valid:"-"` // ไม่ตรวจสอบ FK
	Course   Course `gorm:"foreignKey:CourseID"`
}