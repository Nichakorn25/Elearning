package entity

import (
	"time"

	"gorm.io/gorm"
)

type Purchase struct {
	gorm.Model
	PurchaseDate time.Time `json:"PurchaseDate" valid:"required~PurchaseDate is required"`

	TotalPrice   float32   `json:"TotalPrice" valid:"required~TotalPrice is required"`

	Payment []Payment `gorm:"foreignKey:PurchaseID"`

	CartID uint `json:"CartID" valid:"-"`
	Cart    Cart `gorm:"foreignKey:CartID"`

	UserID uint `json:"UserID" valid:"-"`
	User   User `gorm:"foreignKey:UserID"`
}