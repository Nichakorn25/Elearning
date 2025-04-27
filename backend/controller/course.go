package controller

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"example.com/Elearning/config"
	"example.com/Elearning/entity"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

func GetCoursesByUserID(c *gin.Context) {
	// รับค่า userID จาก URL parameter
	userID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var courses []entity.Course

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("user_id = ? ", userID).Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, courses)
}

func GetUserInfo(c *gin.Context) {
	// รับค่า userID จาก URL parameter
	userID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var user []entity.User

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("id = ? ", userID).Find(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, user)
}

func GetCetagory(c *gin.Context) {

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var Department []entity.Department

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Find(&Department).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, Department)
}

func GetAllUser(c *gin.Context) {

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var user []entity.User

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Find(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, user)
}

func GetCategoryByID(c *gin.Context) {
	// รับค่า userID จาก URL parameter
	categoryID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var category []entity.Category

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("id = ?", categoryID).Find(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, category)
}

// UpdateCourseExam handles the update of course and exam schedule
func UpdateCourseExam(c *gin.Context) {
	// อ่านข้อมูลที่ส่งมาจาก request body
	var course entity.Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	id := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา course ตาม ID ที่ได้รับจาก URL
	var existingCourse entity.Course
	if err := db.First(&existingCourse, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูล course
	existingCourse.CourseName = course.CourseName
	existingCourse.CourseCode = course.CourseCode
	existingCourse.Credit = course.Credit
	existingCourse.Description = course.Description
	existingCourse.Stage = course.Stage           // เพิ่มการอัปเดต Stage
	existingCourse.SemesterID = course.SemesterID // เพิ่มการอัปเดต SemesterID
	existingCourse.CategoryID = course.CategoryID

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingCourse).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ค้นหาหรือสร้าง exam schedule
	var existingExamSchedule entity.ExamSchedule
	err := db.First(&existingExamSchedule, "course_id = ?", existingCourse.ID).Error
	if err != nil {
		// ถ้าไม่พบ exam schedule ให้สร้างใหม่
		if err := db.Create(&entity.ExamSchedule{
			CourseID:  existingCourse.ID,
			ExamDate:  course.ExamSchedule[0].ExamDate,
			StartTime: course.ExamSchedule[0].StartTime,
			EndTime:   course.ExamSchedule[0].EndTime,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ExamSchedule"})
			return
		}
	} else {
		// ถ้าพบให้ทำการอัพเดต
		existingExamSchedule.ExamDate = course.ExamSchedule[0].ExamDate
		existingExamSchedule.StartTime = course.ExamSchedule[0].StartTime
		existingExamSchedule.EndTime = course.ExamSchedule[0].EndTime

		// บันทึกการอัพเดตในฐานข้อมูล
		if err := db.Save(&existingExamSchedule).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ExamSchedule"})
			return
		}
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, gin.H{
		"course":        existingCourse,
		"exam_schedule": existingExamSchedule,
	})
}

func GetDayOfWeek(c *gin.Context) {

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var dayofweek []entity.DayofWeek

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Find(&dayofweek).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, dayofweek)
}

func CreateSemester(c *gin.Context) {
	var semester entity.Semester

	// Bind JSON data into the semester struct
	if err := c.ShouldBindJSON(&semester); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log ข้อมูลที่ได้รับ
	fmt.Printf("Received data: %+v\n", semester.Year)
	fmt.Printf("Year: %v, Term: %v\n", semester.Year, semester.Term)
	fmt.Printf("StartDate: %v, EndDate: %v\n", semester.StartDate, semester.EndDate)
	fmt.Printf("StartDate: %v (UTC), EndDate: %v (UTC)\n", semester.StartDate.UTC(), semester.EndDate.UTC())

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// สร้างข้อมูลใหม่ในฐานข้อมูล
	if err := db.Create(&semester).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create semester", "details": err.Error()})
		return
	}

	// ส่งข้อความสำเร็จกลับไป
	c.JSON(http.StatusCreated, gin.H{
		"message": "Semester created successfully",
		"data":    semester,
	})
}

func GetSemester(c *gin.Context) {
	var semesters []entity.Semester
	db := config.DB()
	if err := db.Find(&semesters).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, semesters)
}

func GetSemesterID(c *gin.Context) {
	var semester entity.Semester

	db := config.DB()

	// ค้นหา semester ที่มี ID มากที่สุด
	if err := db.Order("id DESC").First(&semester).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Semester not found"})
		return
	}

	// ส่ง ID กลับใน JSON
	c.JSON(http.StatusOK, gin.H{
		"ID": semester.ID,
	})
}

func CreateCourse(c *gin.Context) {

	var course entity.Course

	// ใช้ &course แทน []course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลใน database
	if err := config.DB().Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": course})
}

func CreateEnroll(c *gin.Context) {
	var enroll entity.EnrollmentSuggestion

	// ใช้ &enroll แทนการใช้ []enroll
	if err := c.ShouldBindJSON(&enroll); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบค่าของ enroll ก่อนบันทึก
	fmt.Println("Enroll Data:", enroll)

	if err := config.DB().Create(&enroll).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": enroll})
}

func CreateStudyTime(c *gin.Context) {

	var studytime entity.StudyTime

	// ใช้ &course แทน []course
	if err := c.ShouldBindJSON(&studytime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลใน database
	if err := config.DB().Create(&studytime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": studytime})
}

func GetCourseByDESC(c *gin.Context) {
	var course entity.Course

	db := config.DB()

	if err := db.Order("id DESC").First(&course).Error; err != nil {
		// บันทึกข้อผิดพลาดเพื่อใช้ในการดีบัก
		log.Printf("Error fetching course: %v", err)

		// ส่งกลับข้อผิดพลาด 404 Not Found พร้อมข้อความ
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// ส่ง ID กลับใน JSON
	c.JSON(http.StatusOK, gin.H{
		"ID": course.ID,
	})
}

func GetCourse(c *gin.Context) {
	var courses []entity.Course
	if err := config.DB().
		Preload("Category").
		Preload("User").
		Preload("Semester").
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCoursesByID(c *gin.Context) {
	// รับค่า courseID จาก URL parameter
	courseID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var courses []entity.Course

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี id ตรงกับ courseID ที่ได้รับจากพารามิเตอร์
	if err := db.Preload("Category").Preload("User").Preload("Semester").
		Preload("ExamSchedule", func(db *gorm.DB) *gorm.DB {
			return db.Where("course_id = ?", courseID) // Filter by CourseID in ExamSchedule
		}).
		Where("id = ?", courseID).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, courses)
}

func CreateLesson(c *gin.Context) {
	var lesson entity.Lesson

	// ตรวจสอบ JSON ที่ส่งมา
	if err := c.ShouldBindJSON(&lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// เริ่มต้น Transaction
	tx := config.DB().Begin()

	// ลองสร้างข้อมูลใน Transaction
	if err := tx.Create(&lesson).Error; err != nil {
		tx.Rollback() // ยกเลิก Transaction หากเกิดข้อผิดพลาด
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lesson: " + err.Error()})
		return
	}

	// Commit Transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": lesson})
}

func CreateCourseContent(c *gin.Context) {

	var content entity.CourseContent

	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลใน database
	if err := config.DB().Create(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": content})
}

func CreateCourseVideo(c *gin.Context) {

	var url entity.Url

	if err := c.ShouldBindJSON(&url); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลใน database
	if err := config.DB().Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": url})
}

func GetLessonByCourseID(c *gin.Context) {
	// รับค่า userID จาก URL parameter
	courseID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var lesson []entity.Lesson

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("course_id = ?", courseID).Find(&lesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, lesson)
}

func CreateMaterial(c *gin.Context) {
	// รับค่าจากฟอร์ม
	materialName := c.PostForm("MaterialName")
	lessonIDStr := c.DefaultPostForm("LessonID", "") // รับค่า LessonID เป็น string

	// แปลง LessonID จาก string เป็น uint
	lessonID, err := strconv.Atoi(lessonIDStr) // ใช้ Atoi เพื่อแปลง string เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid LessonID"})
		return
	}

	// รับไฟล์จากคำขอ
	file, err := c.FormFile("FilePath")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}

	// บันทึกไฟล์ลงในโฟลเดอร์ backend/file_teacher
	savePath := filepath.Join("file_teacher", filepath.Base(file.Filename))
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// บันทึกข้อมูล Material ในฐานข้อมูล
	material := entity.Material{
		MaterialName: materialName,
		FilePath:     savePath,
		Status:       "hide",
		LessonID:     uint(lessonID), // แปลงจาก int เป็น uint
	}
	if err := config.DB().Create(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": material})
}

func GetCourseContent(c *gin.Context) {
	// รับค่า lessonID จาก URL parameter
	lessonID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID     uint      `json:"course_id"`
		LessonID     uint      `json:"lesson_id"`
		LessonTitle  string    `json:"lesson_title"`
		ContentID    uint      `json:"content_id"`
		ContentTitle string    `json:"content_title"`
		Status       string    `json:"status"`
		Content      string    `json:"content"`
		CreatedAt    time.Time `json:"created_at"`
	}

	var contentData []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("lessons").
		Select(`
			courses.id AS course_id, 
			lessons.id AS lesson_id, 
			lessons.title AS lesson_title, 
			course_contents.id AS content_id, 
			course_contents.title AS content_title,
			course_contents.content AS content,
			course_contents.status AS status,
			course_contents.created_at AS created_at

		`).
		Joins("INNER JOIN courses ON lessons.course_id = courses.id").
		Joins("INNER JOIN course_contents ON course_contents.lesson_id = lessons.id").
		Where("courses.id = ? AND course_contents.deleted_at IS NULL ", lessonID).
		Scan(&contentData).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, contentData)
}

func UploadPicture(c *gin.Context) {

	var picture entity.CoursePicture

	if err := c.ShouldBindJSON(&picture); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูลใน database
	if err := config.DB().Create(&picture).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": picture})
}

func GetPicture(c *gin.Context) {

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var picture []entity.CoursePicture

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Find(&picture).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, picture)
}

func GetAllCourse(c *gin.Context) {

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var course []entity.Course

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	if err := db.Find(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, course)
}

func GetEnrollByUserID(c *gin.Context) {
	enrollID := c.Param("id")

	var enroll []entity.EnrollmentSuggestion

	// เรียกใช้งานฐานข้อมูล
	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("user_id = ? ", enrollID).Find(&enroll).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, enroll)
}

func GetAllCourseDepartment(c *gin.Context) {
	dapartmentID := c.Param("id")

	var enroll []entity.Course

	// เรียกใช้งานฐานข้อมูล
	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("category_id = ? ", dapartmentID).Find(&enroll).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, enroll)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////// ลบ
func DeleteCourseContent(c *gin.Context) {
	contentID := c.Param("id")

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ลบข้อมูล CourseContent ที่มี contentID ตรงกับที่ส่งมาจาก URL
	if err := db.Where("id = ?", contentID).Delete(&entity.CourseContent{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความตอบกลับเมื่อการลบสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}

func DeleteCourseVideo(c *gin.Context) {
	videoID := c.Param("id")

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ลบข้อมูล CourseContent ที่มี contentID ตรงกับที่ส่งมาจาก URL
	if err := db.Where("id = ?", videoID).Delete(&entity.Url{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความตอบกลับเมื่อการลบสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}

func DeleteCourseMaterial(c *gin.Context) {
	materialID := c.Param("id")

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ลบข้อมูล CourseContent ที่มี contentID ตรงกับที่ส่งมาจาก URL
	if err := db.Where("id = ?", materialID).Delete(&entity.Material{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความตอบกลับเมื่อการลบสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Content deleted successfully"})
}

func DeleteAllaboutCoures(c *gin.Context) {
	courseID := c.Param("id")

	db := config.DB()

	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "ไม่สามารถเริ่มต้น transaction ได้",
			"error":   tx.Error.Error(),
		})
		return
	}

	// ลำดับการลบข้อมูล
	queries := []struct {
		entity interface{}
		query  string
	}{
		// ลบข้อมูล CourseContent
		{entity: &entity.CourseContent{}, query: "lesson_id IN (SELECT lesson_id FROM lessons WHERE course_id = ?)"},
		// ลบข้อมูล Material
		{entity: &entity.Material{}, query: "lesson_id IN (SELECT lesson_id FROM lessons WHERE course_id = ?)"},
		// ลบข้อมูล CourseVideo
		{entity: &entity.Url{}, query: "lesson_id IN (SELECT lesson_id FROM lessons WHERE course_id = ?)"},
		// ลบข้อมูล CoursePicture
		{entity: &entity.CoursePicture{}, query: "course_id = ?"},
		// ลบข้อมูล Lessons
		{entity: &entity.Lesson{}, query: "course_id = ?"},
		// ลบข้อมูล StudyTime (ถ้ามี)
		{entity: &entity.StudyTime{}, query: "course_id = ?"},
		// ลบข้อมูล Semesters (ถ้ามี)
		{entity: &entity.Semester{}, query: "id IN (SELECT semester_id FROM courses WHERE id = ?)"},
		// ลบข้อมูล Course
		{entity: &entity.Course{}, query: "id = ?"},
	}

	// ลูปผ่านทุก Query เพื่อลบข้อมูล
	for _, q := range queries {
		// เช็คว่า courseID มีหรือไม่
		if courseID == "" {
			// ถ้าไม่มี course_id ให้ข้ามการลบตารางนี้ไป
			continue
		}

		// ลบข้อมูล
		if err := tx.Where(q.query, courseID).Delete(q.entity).Error; err != nil {
			// ยกเลิก Transaction ถ้ามีข้อผิดพลาด
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "เกิดข้อผิดพลาดในการลบข้อมูล",
				"error":   err.Error(),
			})
			return
		}
	}

	// Commit Transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
			"error":   err.Error(),
		})
		return
	}

	// ส่งข้อความตอบกลับเมื่อสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"message": "ลบข้อมูล Course และข้อมูลที่เกี่ยวข้องสำเร็จแล้ว",
		"success": true,
	})
}

func DeleteLesson(c *gin.Context) {
	lessonID := c.Param("id")

	db := config.DB()

	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "ไม่สามารถเริ่มต้น transaction ได้",
			"error":   tx.Error.Error(),
		})
		return
	}

	// ลำดับการลบข้อมูล
	queries := []struct {
		entity interface{}
		query  string
	}{
		// ลบข้อมูล CourseContent
		{entity: &entity.CourseContent{}, query: "lesson_id = ?"},
		// ลบข้อมูล Material
		{entity: &entity.Material{}, query: "lesson_id = ?"},
		// ลบข้อมูล CourseVideo
		{entity: &entity.Url{}, query: "lesson_id = ?"},
		// ลบข้อมูล Lessons
		{entity: &entity.Lesson{}, query: "id = ?"},
	}

	// ลูปผ่านทุก Query เพื่อลบข้อมูล
	for _, q := range queries {
		// เช็คว่า courseID มีหรือไม่
		if lessonID == "" {
			// ถ้าไม่มี course_id ให้ข้ามการลบตารางนี้ไป
			continue
		}

		// ลบข้อมูล
		if err := tx.Where(q.query, lessonID).Delete(q.entity).Error; err != nil {
			// ยกเลิก Transaction ถ้ามีข้อผิดพลาด
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "เกิดข้อผิดพลาดในการลบข้อมูล",
				"error":   err.Error(),
			})
			return
		}
	}

	// Commit Transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
			"error":   err.Error(),
		})
		return
	}

	// ส่งข้อความตอบกลับเมื่อสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"message": "ลบข้อมูล Course และข้อมูลที่เกี่ยวข้องสำเร็จแล้ว",
		"success": true,
	})
}

func Unenroll(c *gin.Context) {
	enrollID := c.Param("id")

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ลบข้อมูล CourseContent ที่มี contentID ตรงกับที่ส่งมาจาก URL
	if err := db.Where("course_id = ?", enrollID).Delete(&entity.EnrollmentSuggestion{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความตอบกลับเมื่อการลบสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Enroll deleted successfully"})
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// Update

func UpdateCourse(c *gin.Context) {
	// อ่านข้อมูลที่ส่งมาจาก request body
	var course entity.Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	id := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา lesson ตาม ID ที่ได้รับจาก URL
	var existingCourse entity.Course
	if err := db.First(&existingCourse, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	existingCourse.CourseName = course.CourseName
	existingCourse.CourseCode = course.CourseCode
	existingCourse.Credit = course.Credit
	existingCourse.Description = course.Description

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingCourse).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingCourse)
}

func UpdateMaterial(c *gin.Context) {

	// อ่านข้อมูลที่ส่งมาจาก request body
	var material entity.Material
	if err := c.ShouldBindJSON(&material); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	materialID := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา ตาม ID ที่ได้รับจาก URL
	var existingMaterial entity.Material
	if err := db.First(&existingMaterial, "id = ?", materialID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	if material.Status == "hide" {
		existingMaterial.Status = "active"
	} else if material.Status == "active" {
		existingMaterial.Status = "hide"
	} else {
		existingMaterial.Status = "hide"
	}

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingMaterial).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingMaterial)
}

func UpdateContent(c *gin.Context) {

	// อ่านข้อมูลที่ส่งมาจาก request body
	var Content entity.CourseContent
	if err := c.ShouldBindJSON(&Content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	ContentID := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา ตาม ID ที่ได้รับจาก URL
	var existingContent entity.CourseContent
	if err := db.First(&existingContent, "id = ?", ContentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	if Content.Status == "hide" {
		existingContent.Status = "active"
	} else if Content.Status == "active" {
		existingContent.Status = "hide"
	} else {
		existingContent.Status = "hide"
	}

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingContent)
}

func UpdateUrl(c *gin.Context) {

	// อ่านข้อมูลที่ส่งมาจาก request body
	var Url entity.Url
	if err := c.ShouldBindJSON(&Url); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	UrlID := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา ตาม ID ที่ได้รับจาก URL
	var existingUrl entity.Url
	if err := db.First(&existingUrl, "id = ?", UrlID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	if Url.Status == "hide" {
		existingUrl.Status = "active"
	} else if Url.Status == "active" {
		existingUrl.Status = "hide"
	} else {
		existingUrl.Status = "hide"
	}

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingUrl).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingUrl)
}

func UpdateStatusCourse(c *gin.Context) {

	// อ่านข้อมูลที่ส่งมาจาก request body
	var Course entity.Course
	if err := c.ShouldBindJSON(&Course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	CourseID := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ค้นหา ตาม ID ที่ได้รับจาก URL
	var existingCourse entity.Course
	if err := db.First(&existingCourse, "id = ?", CourseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	if Course.Status == "unavailable" {
		existingCourse.Status = "available"
	} else if Course.Status == "available" {
		existingCourse.Status = "unavailable"
	} else {
		existingCourse.Status = "unavailable"
	}

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingCourse).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingCourse)
}

func UpdateEditContent(c *gin.Context) {
	// อ่านข้อมูลที่ส่งมาจาก request body
	var content entity.CourseContent
	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	id := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	var existingcontent entity.CourseContent
	if err := db.First(&existingcontent, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "content not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	existingcontent.ID = content.ID
	existingcontent.Title = content.Title
	existingcontent.Content = content.Content

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingcontent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingcontent)
}

func UpdateEditUrl(c *gin.Context) {
	// อ่านข้อมูลที่ส่งมาจาก request body
	var url entity.Url
	if err := c.ShouldBindJSON(&url); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	id := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	var existingUrl entity.Url
	if err := db.First(&existingUrl, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "content not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	existingUrl.ID = url.ID
	existingUrl.Title = url.Title
	existingUrl.Url = url.Url

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingUrl).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingUrl)
}

func UpdateEditLesson(c *gin.Context) {
	// อ่านข้อมูลที่ส่งมาจาก request body
	var Lesson entity.Lesson
	if err := c.ShouldBindJSON(&Lesson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อ่านค่า ID จาก URL path
	id := c.Param("id")

	// เชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	var existingLesson entity.Lesson
	if err := db.First(&existingLesson, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	// อัพเดตข้อมูลบทเรียน
	existingLesson.ID = Lesson.ID
	existingLesson.Title = Lesson.Title
	existingLesson.Sequence = Lesson.Sequence

	// บันทึกการอัพเดตในฐานข้อมูล
	if err := db.Save(&existingLesson).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Course"})
		return
	}

	// ส่งข้อมูลที่อัพเดตแล้วกลับไป
	c.JSON(http.StatusOK, existingLesson)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// GET

func GetCourseUrl(c *gin.Context) {
	// รับค่า lessonID จาก URL parameter
	lessonID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID  uint      `json:"course_id"`
		LessonID  uint      `json:"lesson_id"`
		UrlID     uint      `json:"url_id"`
		Title     string    `json:"title"`
		Url       string    `json:"url"`
		Status    string    `json:"status"`
		CreatedAt time.Time `json:"created_at"`
	}

	var videoData []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("lessons").
		Select(`
			courses.id AS course_id, 
			lessons.id AS lesson_id, 
			urls.id AS url_id, 
			urls.title AS title,
			urls.url AS url,
			urls.status AS status,
			urls.created_at AS created_at

		`).
		Joins("INNER JOIN courses ON lessons.course_id = courses.id").
		Joins("INNER JOIN urls ON urls.lesson_id = lessons.id").
		Where("courses.id = ? AND urls.deleted_at IS NULL ", lessonID).
		Scan(&videoData).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	for _, video := range videoData {
		fmt.Println("Created At:", video.CreatedAt) // ใช้ video.CreatedAt แทน CourseContentResponse.CreatedAt
	}
	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, videoData)
}

func GetCourseMaterial(c *gin.Context) {
	// รับค่า lessonID จาก URL parameter
	lessonID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID     uint      `json:"course_id"`
		LessonID     uint      `json:"lesson_id"`
		MaterialID   uint      `json:"material_id"`
		MaterialName string    `json:"material_name"`
		FilePath     string    `json:"file_path"`
		Status       string    `json:"status"`
		CreatedAt    time.Time `json:"created_at"`
	}

	var materialData []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("lessons").
		Select(`
			courses.id AS course_id, 
			lessons.id AS lesson_id, 
			materials.id AS material_id, 
			materials.material_name AS material_name,
			materials.file_path AS file_path,
			materials.status AS status,
			materials.created_at AS created_at

		`).
		Joins("INNER JOIN courses ON lessons.course_id = courses.id").
		Joins("INNER JOIN materials ON materials.lesson_id = lessons.id").
		Where("courses.id = ? AND materials.deleted_at IS NULL", lessonID).
		Scan(&materialData).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, materialData)
}

func GetCourseStudytime(c *gin.Context) {
	// รับค่า lessonID จาก URL parameter
	courseID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID       uint   `json:"course_id"`
		StudyTimeID    uint   `json:"studytime_id"`
		StudyTimeStart string `json:"study_time_start"`
		StudyTimeEnd   string `json:"study_time_end"`
		DayName        string `json:"day_name"`
	}

	var studytimeData []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("study_times").
		Select(`
			courses.id AS course_id, 
			study_times.id AS studytime_id, 
			study_times.study_time_start AS study_time_start, 
			study_times.study_time_end AS study_time_end,
			dayof_weeks.day_name AS day_name
		`).
		Joins("INNER JOIN courses ON study_times.course_id = courses.id").
		Joins("INNER JOIN dayof_weeks ON study_times.id = dayof_weeks.id").
		Where("courses.id = ?", courseID).
		Scan(&studytimeData).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, studytimeData)
}

func GetCourseEnrollUserDepartmentSemester(c *gin.Context) {
	userID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID       uint       `json:"course_id"`
		CourseName     string     `json:"course_name"`
		CourseCode     string     `json:"course_code"`
		UserID         uint       `json:"user_id"`
		FirstName      string     `json:"first_name"`
		LastName       string     `json:"last_name"`
		DepartmentID   uint       `json:"department_id"`
		DepartmentName string     `json:"department_name"`
		SemesterID     uint       `json:"semester_id"`
		Year           uint       `json:"year"`
		Term           uint       `json:"term"`
		PictureID      uint       `json:"picture_id"`
		Picture        string     `json:"picture"`
		Status         string     `json:"status"`
		DeleteAt       *time.Time `json:"deleted_at"`
	}

	var Data []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB().Debug()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Unscoped().Table("enrollment_suggestions").
		Select(`
        courses.id AS course_id,
        courses.course_name AS course_name,
        courses.course_code AS course_code,
        enrollment_suggestions.user_id AS user_id,
        enrollment_suggestions.semester_id AS semester_id,
        users.first_name AS first_name,
        users.last_name AS last_name,
        departments.id AS department_id,
        departments.department_name AS department_name,
        semesters.year AS year,
        semesters.term AS term,
        course_pictures.id AS picture_id,
        course_pictures.picture AS picture,
        courses.status AS status,
        enrollment_suggestions.deleted_at AS deleted_at
    `).
		Joins("LEFT JOIN courses ON enrollment_suggestions.course_id = courses.id").
		Joins("LEFT JOIN users ON enrollment_suggestions.user_id = users.id").
		Joins("LEFT JOIN departments ON users.department_id = departments.id").
		Joins("LEFT JOIN semesters ON enrollment_suggestions.semester_id = semesters.id").
		Joins("LEFT JOIN course_pictures ON courses.id = course_pictures.course_id").
		Where("users.id = ? AND enrollment_suggestions.deleted_at IS NULL", userID).
		Scan(&Data).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Data: %+v\n", Data)

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, Data)
}

func GetCourseByDepartment(c *gin.Context) {
	DepartmentID := c.Param("id")

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID       uint   `json:"course_id"`
		CourseName     string `json:"course_name"`
		CourseCode     string `json:"course_code"`
		UserID         uint   `json:"user_id"`
		FirstName      string `json:"first_name"`
		LastName       string `json:"last_name"`
		DepartmentID   uint   `json:"department_id"`
		DepartmentName string `json:"department_name"`
		SemesterID     uint   `json:"semester_id"`
		Year           uint   `json:"year"`
		Term           uint   `json:"term"`
		PictureID      uint   `json:"picture_id"`
		Picture        string `json:"picture"`
		Status         string `json:"status"`
	}

	var Data []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("departments").
		Select(`
			courses.id AS course_id,
			courses.course_name AS course_name,
			courses.course_code AS course_code,
			users.first_name AS first_name,
			users.last_name AS last_name,
			departments.id AS department_id,
			departments.department_name AS department_name,
			semesters.year AS year,
			semesters.term AS term,
			course_pictures.id AS picture_id,
			course_pictures.picture AS picture,
			courses.status AS status

		`).
		Joins("LEFT JOIN courses ON departments.id = courses.category_id").
		Joins("LEFT JOIN users ON courses.user_id = users.id").
		Joins("LEFT JOIN departments AS user_departments ON users.department_id = user_departments.id").
		Joins("LEFT JOIN semesters ON courses.semester_id = semesters.id").
		Joins("LEFT JOIN course_pictures ON courses.id = course_pictures.course_id").
		Where("departments.id = ?", DepartmentID).
		Scan(&Data).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, Data)
}

func GetCourseAndUsername(c *gin.Context) {

	// โครงสร้างสำหรับเก็บข้อมูลที่รวมมาจากหลายตาราง
	type CourseContentResponse struct {
		CourseID   uint   `json:"course_id"`
		CourseName string `json:"course_name"`
		CourseCode string `json:"course_code"`
		UserID     uint   `json:"user_id"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name"`
	}

	var Data []CourseContentResponse

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ดึงข้อมูลที่มีการ join ระหว่างตาราง
	err := db.Table("courses").
		Select(`
			courses.id AS course_id,
			courses.course_name AS course_name,
			courses.course_code AS course_code,
			users.id AS user_id,
			users.first_name AS first_name,
			users.last_name AS last_name
		`).
		Joins("LEFT JOIN users ON courses.user_id = users.id").
		Scan(&Data).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, Data)
}

func GetEnrollUserID(c *gin.Context) {
	// รับค่า userID จาก URL parameter
	userID := c.Param("id")

	// ตัวแปรสำหรับเก็บข้อมูลคอร์สที่ผู้ใช้สร้าง
	var enroll []entity.EnrollmentSuggestion

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("user_id = ? ", userID).Find(&enroll).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, enroll)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

func GetStudytimeByID(c *gin.Context) {
	// รับค่า courseID จาก URL parameter
	courseID := c.Param("id")

	var study []entity.StudyTime

	// เรียกใช้งานฐานข้อมูล
	db := config.DB()

	// ค้นหาคอร์สที่มี user_id ตรงกับ userID ที่ได้รับจากพารามิเตอร์
	if err := db.Where("course_id = ? ", courseID).Find(&study).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลคอร์สที่พบกลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, study)
}

func DeleteFile(c *gin.Context) {
	id := c.Param("id") // รับ ID จากพารามิเตอร์ใน URL
	var file entity.Material

	// ค้นหาไฟล์ในฐานข้อมูล
	if err := config.DB().First(&file, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// ตรวจสอบว่า file_path มีข้อมูลหรือไม่
	if file.FilePath != "" {
		// ใช้ filepath.Join เพื่อรองรับการกำหนดเส้นทางไฟล์ในระบบปฏิบัติการ
		filePath := filepath.FromSlash(file.FilePath)

		// ตรวจสอบว่าไฟล์มีอยู่ในระบบหรือไม่
		if _, err := os.Stat(filePath); err == nil {
			// ลบไฟล์จริงในระบบ
			if err := os.Remove(filePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to delete the file from the server",
					"details": err.Error(),
				})
				return
			}
		} else if os.IsNotExist(err) {
			// กรณีไฟล์ไม่มีอยู่จริง
			c.JSON(http.StatusNotFound, gin.H{"message": "File not found on the server"})
		} else {
			// กรณีตรวจสอบไฟล์แล้วเกิดข้อผิดพลาด
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Error while checking file existence",
				"details": err.Error(),
			})
			return
		}
	}

	// ลบข้อมูลในฐานข้อมูล
	if err := config.DB().Delete(&file).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the file record"})
		return
	}

	// ส่งสถานะสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}