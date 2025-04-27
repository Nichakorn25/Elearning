package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	PaymentDate time.Time `json:"PaymentDate" valid:"required~PaymentDate is required"`
	Amount      float32   `json:"Amount" valid:"required~Amount is required"`
	Slip        string    `json:"Slip" gorm:"type:longtext" valid:"required~Slip is required" `
	TransactionLog []TransactionLog `gorm:"foreignKey:PaymentID"`

	UserID uint `json:"UserID" valid:"-"`
	User   User `gorm:"foreignKey:UserID"`

	PurchaseID uint     `json:"PurchaseID" valid:"-"`
	Purchase   Purchase `gorm:"foreignKey:PurchaseID"`

	MethodID      uint          `json:"MethodID" valid:"-"`
	PaymentMethod PaymentMethod `gorm:"foreignKey:MethodID"`
}