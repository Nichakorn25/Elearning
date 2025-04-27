package entity

import (
	"gorm.io/gorm"
)

type SellerBankAccount struct {
	gorm.Model
	BankNumber string `json:"BankNumber" valid:"required~BankNumber is required,numeric~BankNumber must be numeric,minstringlength(10)~BankNumber must be at least 10 digits"`
	BankID     uint   `json:"BankID" valid:"required~BankID is required"`
	Bank       Bank   `gorm:"foreignKey:BankID"`
	SellerID   uint   `json:"SellerID" valid:"-"`
	Seller     Seller `gorm:"foreignKey:SellerID"`
}