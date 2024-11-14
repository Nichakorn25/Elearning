package Exam

import (
	"backend/entity/CreateCourse" // นำเข้า package ที่มี struct Course
	"gorm.io/gorm"
	"time"
)

type Test struct {
	gorm.Model
	Title       string    `json:"Title"`
	Description string    `json:"Description"`
	DueDate     time.Time `json:"DueDate"`

	CourseID uint                `json:"CourseID"`
	Course   CreateCourse.Course `gorm:"foreignKey:CourseID"` // ใช้ Course จาก package CreateCourse
}
