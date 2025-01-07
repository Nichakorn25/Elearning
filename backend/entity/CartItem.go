package entity

import (
	"time"

	"gorm.io/gorm"
)

type CartItem struct {
	gorm.Model
	AddedDate time.Time `json:"AddedDate"`

	SheetID uint  `json:"SheetID"`
	Sheet   Sheet `gorm:"foreignKey:SheetID"`

	CartID uint `json:"CartID"`
	Cart   Cart `gorm:"foreignKey:CartID"`

}
