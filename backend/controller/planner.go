package controller

import (
	"elearning/config"
	"elearning/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"fmt"
)

//ดึงคอร์สBytermid
func SearchCourses(c *gin.Context) {
	// รับพารามิเตอร์ filter และ semester
	searchQuery := c.Query("filter")
	semester := c.Query("semester")

	// สร้าง slice สำหรับเก็บผลลัพธ์
	var courses []entity.Course
	var result []map[string]interface{}

	db := config.DB()

	// ดึงข้อมูล Course พร้อม StudyTime และ ExamSchedule
	err := db.Preload("StudyTime").Preload("ExamSchedule").
		Where("semester_id = ? AND course_name LIKE ?", semester, "%"+searchQuery+"%").
		Find(&courses).Error

	if err != nil {
		fmt.Println("Database Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// รวม Course, StudyTime และ ExamSchedule ในรูปแบบ JSON
	for _, course := range courses {
		courseData := map[string]interface{}{
			"id":          course.ID,
			"CourseName":  course.CourseName,
			"CourseDate":  course.CourseDate,
			"Credit":      course.Credit,
			"Description": course.Description,
			"CategoryID":  course.CategoryID,
			"UserID":      course.UserID,
			"SemesterID":  course.SemesterID,
			"DayofWeekID": course.DayofWeekID,
			"StudyTimes":  []map[string]interface{}{},
			"ExamSchedule": nil, // Default value
		}

		// เพิ่ม StudyTime ลงใน JSON
		for _, studyTime := range course.StudyTime {
			studyTimeData := map[string]interface{}{
				"StudyDay":       studyTime.StudyDay,
				"StudyTimeStart": studyTime.StudyTimeStart,
				"StudyTimeEnd":   studyTime.StudyTimeEnd,
			}
			courseData["StudyTimes"] = append(courseData["StudyTimes"].([]map[string]interface{}), studyTimeData)
		}

		// เพิ่ม ExamSchedule ลงใน JSON (ถ้ามี)
		if len(course.ExamSchedule) > 0 {
			exam := course.ExamSchedule[0] // ใช้เฉพาะรายการแรก
			examData := map[string]interface{}{
				"ExamDate":  exam.ExamDate,
				"StartTime": exam.StartTime,
				"EndTime":   exam.EndTime,
			}
			courseData["ExamSchedule"] = examData
		}

		result = append(result, courseData)
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, result)
}


// ดึง StudyTime ตาม CourseID
func GetStudyTimeByCourseId(c *gin.Context) {
	courseId := c.Param("courseId")

	var studyTimes []entity.StudyTime
	db := config.DB()

	results := db.Where("course_id = ?", courseId).Find(&studyTimes)

	if results.Error != nil {
		fmt.Println("Database Error:", results.Error.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, studyTimes)
}

// ดึง ExamSchedule ตาม CourseID
func GetExamScheduleByCourseId(c *gin.Context) {
	courseId := c.Param("courseId")

	var examSchedules []entity.ExamSchedule
	db := config.DB()

	results := db.Where("course_id = ?", courseId).Find(&examSchedules)

	if results.Error != nil {
		fmt.Println("Database Error:", results.Error.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, examSchedules)
}

// เพิ่มคอร์สไปยังตารางเรียน
func AddCourseToSchedule(c *gin.Context) {
    var schedule entity.ClassSchedule
    if err := c.ShouldBindJSON(&schedule); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    fmt.Printf("Received data: %+v\n", schedule) // ตรวจสอบข้อมูลที่รับเข้ามา

    if err := config.DB().Create(&schedule).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, schedule)
}


// ลบคอร์สออกจากตารางเรียน
func RemoveCourseFromSchedule(c *gin.Context) {
	scheduleId := c.Param("scheduleId")

	db := config.DB()

	if err := db.Delete(&entity.ClassSchedule{}, scheduleId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course removed from schedule successfully"})
}

//test 
//use ดึงตารางเรียนโดยไอดีผู้ใช้
func GetClassScheduleByUserID(c *gin.Context) {
	userID := c.Param("userID")

	var schedules []entity.ClassSchedule

	// Preload ความสัมพันธ์ที่เกี่ยวข้อง
	if err := config.DB().
		Where("user_id = ?", userID).
		Preload("DayofWeek").   // ดึงข้อมูล DayOfWeek
		Preload("Course").      // ดึงข้อมูล Course
		Find(&schedules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, schedules)
}

// บันทึกข้อมูลลงใน ClassSchedule
func AddClassSchedule(c *gin.Context) {
	var classSchedule entity.ClassSchedule

	// ตรวจสอบและ Bind ข้อมูลจาก Request Body
	if err := c.ShouldBindJSON(&classSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่ามีข้อมูล Course, User, หรือ DayOfWeek ID ที่จำเป็นหรือไม่
	if classSchedule.CourseID == 0 || classSchedule.UserID == 0 || classSchedule.DayofWeekID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID, UserID, and DayofWeekID are required"})
		return
	}

	// บันทึกข้อมูลลงในฐานข้อมูล
	if err := config.DB().Create(&classSchedule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับหลังจากบันทึกสำเร็จ
	c.JSON(http.StatusCreated, classSchedule)
}

// ลบวิชาออกจาก ClassSchedule โดยใช้ CourseID use
func RemoveClassScheduleByCourseID(c *gin.Context) {
	courseID := c.Param("courseID") // รับ CourseID จาก Path Parameter

	// ตรวจสอบว่า CourseID เป็นค่าที่ถูกต้องหรือไม่
	if courseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID is required"})
		return
	}

	// ลบข้อมูลจาก ClassSchedule โดยใช้ CourseID
	if err := config.DB().Where("course_id = ?", courseID).Delete(&entity.ClassSchedule{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความกลับเมื่อการลบสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Class schedule removed successfully"})
}

//test