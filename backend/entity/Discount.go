package entity

import (
	"gorm.io/gorm"
	"time"
)


type Discount struct {
	gorm.Model
	Code      string    `json:"Code"`
	ValidFrom time.Time `json:"ValidFrom"`
	ValidEnd  time.Time `json:"ValidEnd"`

	Purchase []Purchase `gorm:"foreignKey:DiscountID"`
}
