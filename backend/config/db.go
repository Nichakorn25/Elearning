package config

import (
	"elearning/entity"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)


var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("elearning.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// Set Database เริ่มต้น
func SetupDatabase() {
	db.AutoMigrate(
		&entity.Annoucement{},
		&entity.AnswerOption{},
		&entity.Assignment{},
		&entity.Attachment{},
		&entity.CartItem{},
		&entity.Category{},
		&entity.Course{},
		&entity.CourseContent{},
		&entity.CourseVideo{},
		&entity.DayofWeek{},
		&entity.Department{},
		&entity.Discount{},
		&entity.ExamSchedule{},
		&entity.Grade{},
		&entity.Lesson{},
		&entity.Log{},
		&entity.Major{},
		&entity.Material{},
		&entity.Module{},
		&entity.Payment{},
		&entity.PaymentMethod{},
		&entity.PaymentStatus{},
		&entity.Permission{},
		&entity.ProfilePicture{},
		&entity.Purchase{},
		&entity.QuizQuestion{},
		&entity.Review{},
		&entity.Role{},
		&entity.Semester{},
		&entity.Sheet{},
		&entity.StudentAnswer{},
		&entity.Submission{},
		&entity.Test{},
		&entity.TransactionLog{},
		&entity.User{},
	)
	departments := []entity.Department{
		{DepartmentName: "Engineering"},
		{DepartmentName: "Science"},
		{DepartmentName: "Arts"},
	}
	
	for _, dept := range departments {
		db.FirstOrCreate(&dept, entity.Department{DepartmentName: dept.DepartmentName})
	}

	// Add sample majors
	majors := []entity.Major{
		{MajorName: "Computer Engineering", DepartmentID: 1},
		{MajorName: "Civil Engineering", DepartmentID: 1},
		{MajorName: "Physics", DepartmentID: 2},
		{MajorName: "Chemistry", DepartmentID: 2},
		{MajorName: "History", DepartmentID: 3},
		{MajorName: "Literature", DepartmentID: 3},
	}
	
	for _, major := range majors {
		db.FirstOrCreate(&major, entity.Major{MajorName: major.MajorName})
	}
	
}
