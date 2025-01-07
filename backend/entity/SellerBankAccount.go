package entity

import (
	"gorm.io/gorm"
)

type SellerBankAccount struct {
	gorm.Model
	BankNumber string `json:"BankNumber" valid:"required~BankNumber is required,numeric~BankNumber must be numeric"`
	BankID     uint   `json:"BankID" valid:"required~BankID is required"`
	Bank       Bank   `gorm:"foreignKey:BankID"`
	SellerID   uint   `json:"SellerID" valid:"required~SellerID is required"`
	Seller     Seller  `gorm:"foreignKey:SellerID"`
}
