package entity

import (
	"time"

	"gorm.io/gorm"
)

type Purchase struct {
	gorm.Model
	PurchaseDate time.Time `json:"PurchaseDate"`
	TotalPrice   float32   `json:"TotalPrice"`

	Payment []Payment `gorm:"foreignKey:PurchaseID"`

	CartID uint `json:"CartID"`
	Cart    Cart `gorm:"foreignKey:CartID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	DiscountID uint     `json:"DiscountID"`
	Discount   Discount `gorm:"foreignKey:DiscountID"`
}
