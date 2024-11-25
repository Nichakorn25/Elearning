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
		{DepartmentName: "สำนักวิชาวิทยาศาสตร์ (Institute of Science)"},
		{DepartmentName: "สำนักวิชาเทคโนโลยีการเกษตร (Institute of Agricultural Technology)"},
		{DepartmentName: "สำนักวิชาเทคโนโลยีสังคม (Institute of Social Technology)"},
		{DepartmentName: "สำนักวิชาวิศวกรรมศาสตร์ (Institute of Engineering)"},
		{DepartmentName: "สำนักวิชาพยาบาลศาสตร์ (Institute of Nursing)"},
		{DepartmentName: "สำนักวิชาแพทยศาสตร์ (Institute of Medicine)"},
		{DepartmentName: "สำนักวิชาทันตแพทยศาสตร์ (Institute of Dentistry)"},
		{DepartmentName: "สำนักวิชาสาธารณสุขศาสตร์ (Institute of Public Health)"},
		{DepartmentName: "สำนักวิชาศาสตร์และศิลป์ดิจิทัล (Institute of Digital Arts and Science)"},

	}
	
	for _, dept := range departments {
		db.FirstOrCreate(&dept, entity.Department{DepartmentName: dept.DepartmentName})
	}

	// Add sample majors
	majors := []entity.Major{
		{MajorName: "สาขาวิชาคณิตศาสตร์ (School of Mathematics)", DepartmentID: 1},
		{MajorName: "สาขาวิชาชีววิทยา (School of Biology)", DepartmentID: 1},
		{MajorName: "สาขาวิชาฟิสิกส์ (School of Physics)", DepartmentID: 1},
		{MajorName: "สาขาวิชาเคมี (School of Chemistry)", DepartmentID: 1},
		{MajorName: "สาขาวิชาวิทยาศาสตร์การกีฬา (School of Sports Science)", DepartmentID: 1},
		{MajorName: "สาขาวิชาปรีคลินิก", DepartmentID: 1},
		{MajorName: "สาขาวิชาภูมิสารสนเทศ", DepartmentID: 1},

		{MajorName: "สาขาวิชาเทคโนโลยีการผลิตพืช (School of Crop Production Technology)", DepartmentID: 2},
		{MajorName: "สาขาวิชาเทคโนโลยีการผลิตสัตว์ (School of Animal Production Technology)", DepartmentID: 2},
		{MajorName: "สาขาวิชาเทคโนโลยีชีวภาพ (School of Biotechnology)", DepartmentID: 2},
		{MajorName: "สาขาวิชาเทคโนโลยีอาหาร (School of Food Technology)", DepartmentID: 2},

		{MajorName: "สาขาวิชาศึกษาทั่วไป (School of General Education)", DepartmentID: 3},
		{MajorName: "สาขาวิชาภาษาต่างประเทศ (School of Foreign Languages)", DepartmentID: 3},
		{MajorName: "สาขาวิชาเทคโนโลยีสารสนเทศ (School of Information Technology)", DepartmentID: 3},
		{MajorName: "สาขาวิชาเทคโนโลยีการจัดการ (School of Management Technology)", DepartmentID: 3},

		{MajorName: "สาขาวิชาวิศวกรรมเกษตร (School of Agricultural Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมขนส่ง (School of Transportation Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมคอมพิวเตอร์ ( School of Computer Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมเคมี (School of Chemical Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมเครื่องกล (School of Mechanical Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมเซรามิก (School of Ceramic Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมโทรคมนาคม (School of Telecommunication Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมไฟฟ้า (School of Electrical Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมพอลิเมอร์ (School of Polymer Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมวิศวกรรมโยธา (School of Civil Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมโลหการ (School of Metallurgical Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมสิ่งแวดล้อม (School of Environmental Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมอุตสาหการ (School of Industrial Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาเทคโนโลยีธรณี (School of Geotechnology)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมการผลิต (School of Manufacturing Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมอิเล็กทรอนิกส์ (School of Electronic Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาเทคโนโลยีการออกแบบ (School of Material Innovation and Design Technology)", DepartmentID: 4},
		{MajorName: "สาขาวิศวกรรมโยธาและโครงสร้างพื้นฐาน (Civil and Infrastructure Engineering)", DepartmentID: 4},
		{MajorName: "สาขาวิชาวิศวกรรมพรีซิชั่น (School of Precision Engineering)", DepartmentID: 4},

		{MajorName: "สาขาวิชาการพยาบาลพื้นฐาน", DepartmentID: 5},
		{MajorName: "สาขาวิชาการพยาบาลผู้ใหญ่และผู้สูงอายุ", DepartmentID: 5},
		{MajorName: "สาขาวิชาการพยาบาลอนามัยชุมชน", DepartmentID: 5},
		{MajorName: "สาขาวิชาการพยาบาลครอบครัวและผดุงครรภ์", DepartmentID: 5},
		{MajorName: "สาขาวิชาการพยาบาลเด็กและวัยรุ่น", DepartmentID: 5},
		{MajorName: "สาขาวิชาการพยาบาลสุขภาพจิตและจิตเวช", DepartmentID: 5},

		{MajorName: "สาขาวิชากุมารเวชศาสตร์", DepartmentID: 6},
		{MajorName: "สาขาวิชาจักษุวิทยา", DepartmentID: 6},
		{MajorName: "สาขาวิชาจิตเวชศาสตร์", DepartmentID: 6},
		{MajorName: "สาขาวิชานิติเวชศาสตร์", DepartmentID: 6},
		{MajorName: "สาขาวิชาพยาธิวิทยา (Department of Pathology)", DepartmentID: 6},
		{MajorName: "สาขาวิชารังสีวิทยา", DepartmentID: 6},
		{MajorName: "สาขาวิชาวิสัญญีวิทยา", DepartmentID: 6},
		{MajorName: "สาขาวิชาเวชศาสตร์ครอบครัวและเวชศาสตร์ชุมชน (Department of Family Medicine and Community Medicin)", DepartmentID: 6},
		{MajorName: "สาขาวิชาเวชศาสตร์ฟื้นฟู", DepartmentID: 6},
		{MajorName: "สาขาวิชาศัลยศาสตร์ (Department of Surgery)", DepartmentID: 6},
		{MajorName: "สาขาวิชาสูติศาสตร์และนรีเวชศาสตร์", DepartmentID: 6},
		{MajorName: "สาขาวิชาโสต ศอ นาสิกวิทยา", DepartmentID: 6},
		{MajorName: "สาขาวิชาออร์โธปิดิกส์", DepartmentID: 6},
		{MajorName: "สาขาวิชาอายุรศาสตร์", DepartmentID: 6},

		{MajorName: "สาขาวิชาสุขภาพช่องปากและครอบครัวและชุมชน", DepartmentID: 7},
		{MajorName: "สาขาวิชาสุขภาพช่องปากเด็ก", DepartmentID: 7},
		{MajorName: "สาขาวิชาสุขภาพช่องปากวัยรุ่น", DepartmentID: 7},
		{MajorName: "สาขาวิชาสุขภาพช่องปากผู้ใหญ่", DepartmentID: 7},
		{MajorName: "สาขาวิชาสุขภาพช่องปากผู้สูงอายุ", DepartmentID: 7},

		{MajorName: "สาขาวิชาอาชีวอนามัยและความปลอดภัย (School of Occupational Health and Safety)", DepartmentID: 8},
		{MajorName: "สาขาวิชาอนามัยสิ่งแวดล้อม (School of Environmental Health)", DepartmentID: 8},
		{MajorName: "สาขาวิชาโภชนวิทยาและการกำหนดอาหาร", DepartmentID: 8},

		{MajorName: "สาขาวิชาเทคโนโลยีดิจิทัล", DepartmentID: 9},
		{MajorName: "สาขาวิชานิเทศศาสตร์ดิจิทัล", DepartmentID: 9},
	}

	for _, major := range majors {
		db.FirstOrCreate(&major, entity.Major{MajorName: major.MajorName})
	}
	
}
