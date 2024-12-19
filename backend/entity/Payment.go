package entity

import ( 
	"time"
	"gorm.io/gorm"
)
type Payment struct {
	gorm.Model
	PaymaneDate	time.Time `json:"PaymaneDate"`
	Amount float32 `json:"Amount"`
	
	TransactionLog []TransactionLog `gorm:"foreignKey:PaymentID"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`

	PurchaseID uint `json:"PurchaseID"`
	Purchase   Purchase `gorm:"foreignKey:PurchaseID"`

	MethodID uint `json:"MethodID"`
	PaymentMethod   PaymentMethod `gorm:"foreignKey:MethodID"`

}