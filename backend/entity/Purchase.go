package entity

import (
	"gorm.io/gorm"
	"time"
)

type Purchase struct {
	gorm.Model
	PurchaseDate time.Time `json:"PurchaseDate"`
	TotalPrice   float32   `json:"TotalPrice"`

	Payment []Payment `gorm:"foreignKey:PurchaseID"`

	SheetID uint  `json:"SheetID"`
	Sheet   Sheet `gorm:"foreignKey:SheetID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	DiscountID uint     `json:"DiscountID"`
	Discount   Discount `gorm:"foreignKey:DiscountID"`
}
