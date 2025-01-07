package entity

import "gorm.io/gorm"

type Cart struct {
    gorm.Model
    CartStatusID uint       `json:"CartStatusID"`
    CartStatus   CartStatus `gorm:"foreignKey:CartStatusID"`
    UserID       uint       `json:"UserID"`
    User         User       `gorm:"foreignKey:UserID"`
    CartItem     []CartItem `gorm:"foreignKey:CartID"`
}
