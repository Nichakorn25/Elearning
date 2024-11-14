package Payment

import (
	"gorm.io/gorm"
)
type PaymentMethod struct {
	gorm.Model
	MethodName  string `json:"MethodName"`

	Payment []Payment `gorm:"foreignKey:MethodID"`

}