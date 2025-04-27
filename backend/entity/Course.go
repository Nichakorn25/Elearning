package entity

import (
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	CourseName  string `json:"CourseName" valid:"required~ใส่ชื่อคอร์ส"`
	CourseCode  string `json:"CourseCode" valid:"required~ใส่รหัสวิชา"`
	Credit      uint   `json:"Credit" valid:"required~ใส่หน่วยกิต, matches(^[0-9]{1}$)~กรุณาใส่เลขหลักเดียว"`
	Description string `json:"Description"`
	Stage       uint   `json:"Stage" valid:"required~Stage is required, matches(^[1-2]{1}$)"`
	Status      string `json:"Status"`

	ExamSchedule []ExamSchedule `gorm:"foreignKey:CourseID"`

	Sheet []Sheet `gorm:"foreignKey:CourseID"`

	Lesson []Lesson `gorm:"foreignKey:CourseID"`

	Test []Test `gorm:"foreignKey:CourseID"`

	Assignment []Assignment `gorm:"foreignKey:CourseID"`

	StudyTime []StudyTime `gorm:"foreignKey:CourseID"`

	ClassSchedule []ClassSchedule `gorm:"foreignKey:CourseID"`

	// DayofWeekID uint `json:"DayofWeekID"`
	// DayofWeek   DayofWeek `gorm:"foreignKey:DayofWeekID"`

	CategoryID uint     `json:"CategoryID" valid:"required~CategoryID is required, matches(^[1-9]$)"`
	Category   Category `gorm:"foreignKey:CategoryID"`

	UserID uint `json:"UserID" valid:"required~UserID is required, matches(^\\d+$)"`
	User   User `gorm:"foreignKey:UserID"`

	SemesterID uint     `json:"SemesterID" valid:"required~Semester is required, matches(^\\d+$)"`
	Semester   Semester `gorm:"foreignKey:SemesterID"`

}