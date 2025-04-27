package entity

import (
	"gorm.io/gorm"
)

type Seller struct {
	gorm.Model
	Name               string              `json:"Name" valid:"required~Name is required"`
	UserID             uint                `json:"UserID" valid:"-"`
	User               User                `gorm:"foreignKey:UserID"`
	SellerBankAccount []SellerBankAccount `gorm:"foreignKey:SellerID"`
	Sheet              []Sheet             `gorm:"foreignKey:SellerID"`
}