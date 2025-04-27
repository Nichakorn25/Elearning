
package entity

import (
	"gorm.io/gorm"
	"time"
)

type Task struct {
	gorm.Model
	Title       string    `json:"title" gorm:"not null"`
	Date        time.Time `json:"date" gorm:"not null"`
	Time        time.Time `json:"time"` // รูปแบบเช่น "09:00"
	Description string    `json:"description"`

	UserID uint `json:"UserID"`
	User   User `gorm:"foreignKey:UserID"`
}
