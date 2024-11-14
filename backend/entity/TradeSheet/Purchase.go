package TradeSheet

import (
	"elearning/entity/Payment"
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
	Profile.User   User `gorm:"foreignKey:UserID"`

	DiscountID uint     `json:"DiscountID"`
	Payment.Discount   Discount `gorm:"foreignKey:DiscountID"`
}
