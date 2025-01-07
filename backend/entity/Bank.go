package entity

import (
	"gorm.io/gorm"
)

type Bank struct {
	gorm.Model
	BankName string `json:"BankName"`
	SellerBankAccount     []SellerBankAccount `gorm:"foreignKey:BankID"`
}
