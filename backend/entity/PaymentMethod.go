package entity

import (
	"gorm.io/gorm"
)
type PaymentMethod struct {
	gorm.Model
	Name        string `json:"name"`
    Type        string `json:"type"`  
    Account     string `json:"account,omitempty"`   
    AccountName string `json:"account_name,omitempty"` 
	BankCode string `json:"bank_code"`
	Payment []Payment `gorm:"foreignKey:MethodID"`
}