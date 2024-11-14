package Payment

import (
	"entity/CreateCourse/Course"
	"gorm.io/gorm"
)

type Discount struct {
	gorm.Model
	Title         string  `json:"Title"`
	Description   string  `json:"Description"`
	Price         float32 `json:"Price"`
	Rating        float32 `json:"Rating"`
	PurchaseCount uint    `json:"PurchaseCount"`

	CourseID uint   `json:"CourseID"`
	Course   Course `gorm:"foreignKey:CourseID"`
}
