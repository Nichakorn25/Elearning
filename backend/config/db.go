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
		&entity.StudyTime{},
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
	for _, pkg := range departments {
		db.FirstOrCreate(&pkg, entity.Department{DepartmentName: pkg.DepartmentName})
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
	for _, pkg := range majors {
		db.FirstOrCreate(&pkg, entity.Major{MajorName: pkg.MajorName})
	}

	modules := []entity.Module{
		{ModuleName: "Course Management: สำหรับการจัดการคอร์ส"},
		{ModuleName: "User Management: สำหรับการจัดการข้อมูลผู้ใช้"},
		{ModuleName: "Lesson Management: สำหรับการจัดการบทเรียนและเนื้อหาในคอร์ส"},
		{ModuleName: "Assignment Management: สำหรับการจัดการการบ้านและแบบฝึกหัด"},
		{ModuleName: "Test Management: สำหรับการจัดการการทดสอบออนไลน์"},
		{ModuleName: "Announcement Management: สำหรับการโพสต์และจัดการประกาศ"},
		{ModuleName: "Profile Management: สำหรับการจัดการข้อมูลโปรไฟล์"},
		{ModuleName: "Sheet Marketplace: สำหรับการซื้อขายชีทและเอกสารการเรียน"},
		{ModuleName: "Payment Management: สำหรับการจัดการการชำระเงิน"},
		{ModuleName: "Appointment Management: สำหรับการจัดการการนัดหมายกับอาจารย์"},
		{ModuleName: "Schedule Management: สำหรับการจัดการตารางเรียน"},
	}
	for _, pkg := range modules {
		db.FirstOrCreate(&pkg, entity.Module{ModuleName: pkg.ModuleName})
	}

	roles := []entity.Role{
		{RoleName: "Student"},
		{RoleName: "Teacher"},
		{RoleName: "Admin"},
	}
	for _, pkg := range roles {
		db.FirstOrCreate(&pkg, entity.Role{RoleName: pkg.RoleName})
	}

	hashedPassword, _ := HashPassword("123456")
	//BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	//User
	User := []entity.User{
		{Username: "B6504540", Password: hashedPassword, FirstName: "ศิขเรศ", LastName: "เปภักดี", Email: "B6504540@g.sut.ac.th", Phone: "0987654321", RoleID: 2, DepartmentID: 4, MajorID: 3},
		{Username: "B6510923", Password: hashedPassword, FirstName: "ธนวัฒน์", LastName: "ผ่านบุตร", Email: "B6510923@g.sut.ac.th", Phone: "0987654321", RoleID: 3},
		{Username: "B6516093", Password: hashedPassword, FirstName: "สุเมธ", LastName: "สาลีพันธ์", Email: "B6516093@g.sut.ac.th", Phone: "0987654321", RoleID: 2, DepartmentID: 4, MajorID: 17},
		{Username: "B6524548", Password: hashedPassword, FirstName: "เจษฎาภรณ์", LastName: "ปิ่นใจ", Email: "B6524548@g.sut.ac.th", Phone: "0987654321", RoleID: 1},
		{Username: "B6525972", Password: hashedPassword, FirstName: "ณิชากร", LastName: "จันทร์ยุทา", Email: "B6525972@g.sut.ac.th", Phone: "0987654321", RoleID: 1},
	}
	for _, pkg := range User {
		db.FirstOrCreate(&pkg, entity.User{Username: pkg.Username})
	}

	permissions := []entity.Permission{
		{CanCreate: false, CanRead: true, CanUpdate: false, CanDelete: false, ModuleID: 1, RoleID: 1},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 2, RoleID: 1},
		{CanCreate: false, CanRead: true, CanUpdate: false, CanDelete: false, ModuleID: 3, RoleID: 1},
		{CanCreate: false, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 4, RoleID: 1},
		{CanCreate: false, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 5, RoleID: 1},
		{CanCreate: false, CanRead: true, CanUpdate: false, CanDelete: false, ModuleID: 6, RoleID: 1},
		{CanCreate: false, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 7, RoleID: 1},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 8, RoleID: 1},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 9, RoleID: 1},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 10, RoleID: 1},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 11, RoleID: 1},

		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 1, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 2, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 3, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 4, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 5, RoleID: 2},
		{CanCreate: false, CanRead: true, CanUpdate: false, CanDelete: false, ModuleID: 6, RoleID: 2},
		{CanCreate: false, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 7, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 8, RoleID: 2},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: false, ModuleID: 9, RoleID: 2},
		{CanCreate: false, CanRead: true, CanUpdate: false, CanDelete: false, ModuleID: 10, RoleID: 2},
		{CanCreate: false, CanRead: false, CanUpdate: false, CanDelete: false, ModuleID: 11, RoleID: 2},

		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 1, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 2, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 3, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 4, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 5, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 6, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 7, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 8, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 9, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 10, RoleID: 3},
		{CanCreate: true, CanRead: true, CanUpdate: true, CanDelete: true, ModuleID: 11, RoleID: 3},
	}
	for _, pkg := range permissions {
		db.FirstOrCreate(&pkg, entity.Permission{RoleID: pkg.ModuleID})
	}

	DayofWeek := []entity.DayofWeek{
		{DayName: "วันอาทิตย์"},
		{DayName: "วันจันทร์"},
		{DayName: "วันอังคาร"},
		{DayName: "วันพุธ"},
		{DayName: "วันพฤหัสบดี"},
		{DayName: "วันศุกร์"},
		{DayName: "วันเสาร์"},
	}

	for _, pkg := range DayofWeek {
		db.FirstOrCreate(&pkg, entity.DayofWeek{DayName: pkg.DayName})
	}

	Category := []entity.Category{
		{CategoryID: 1, CategoryName: "วิทยาศาสตร์"},
		{CategoryID: 2, CategoryName: "เทคโนโยยีสังคม"},
		{CategoryID: 3, CategoryName: "เทคโนโยยีการเกษตร"},
		{CategoryID: 4, CategoryName: "แพทยศาสตร์"},
		{CategoryID: 5, CategoryName: "วิศวกรรมศาสตร์"},
		{CategoryID: 6, CategoryName: "พยาบาลศาสตร์"},
		{CategoryID: 7, CategoryName: "ทันตแพทยศาสตร์"},
		{CategoryID: 8, CategoryName: "สาธารณสุขศาสตร์"},
		{CategoryID: 9, CategoryName: "ศาสตร์และศิลป์ดิจิทัล"},
	}

	for _, pkg := range Category {
		db.FirstOrCreate(&pkg, entity.Category{CategoryID: pkg.CategoryID})
	}


}
