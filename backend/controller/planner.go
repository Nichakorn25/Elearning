package controller

import (
	"elearning/entity"
    "elearning/config"
	"net/http"

	"github.com/gin-gonic/gin"
	"fmt"
)

//test
func SearchCoursesByTerm(c *gin.Context) {
	// รับพารามิเตอร์ Term ID จาก Path
	termID := c.Param("id")
	searchQuery := c.Query("filter")

	// สร้าง slice สำหรับเก็บผลลัพธ์
	var courses []entity.Course
	var result []map[string]interface{}

	db := config.DB()

	// ดึงข้อมูล Course พร้อม StudyTime และ ExamSchedule ตาม Term ID และคำค้นหา
	err := db.Preload("StudyTime.DayofWeek").
		Preload("ExamSchedule").
		Where("semester_id = ? AND course_name LIKE ?", termID, "%"+searchQuery+"%").
		Find(&courses).Error

	if err != nil {
		fmt.Println("Database Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// รวม Course, StudyTime และ ExamSchedule ในรูปแบบ JSON
	for _, course := range courses {
		courseData := map[string]interface{}{
			"CourseID":     course.ID,            // ส่ง CourseID หรือ id ของ Course
			"CourseCode":	course.CourseCode,
			"CourseName":   course.CourseName,    // ชื่อวิชา
			"CourseDate":   course.CreatedAt,     // วันที่สร้างของวิชา
			"Credit":       course.Credit,        // หน่วยกิต
			"Description":  course.Description,   // คำอธิบาย
			"CategoryID":   course.CategoryID,    // หมวดหมู่
			"UserID":       course.UserID,        // ผู้ใช้
			"SemesterID":   course.SemesterID,    // เทอม
			"StudyTimes":   []map[string]interface{}{}, // รายละเอียดเวลาเรียน
			"ExamSchedule": []map[string]interface{}{},                 // Default value สำหรับตารางสอบ
		}

		// เพิ่ม StudyTime ลงใน JSON
		for _, studyTime := range course.StudyTime {
			studyTimeData := map[string]interface{}{
				"StudyDay":       studyTime.DayofWeek.DayName,
				"DayofWeekID":	studyTime.DayofWeekID,
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

//test


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

    // Bind JSON จาก Request Body
    if err := c.ShouldBindJSON(&classSchedule); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        fmt.Printf("Bind Error: %v\n", err)
        return
    }

    // ตรวจสอบว่าข้อมูลที่จำเป็นครบหรือไม่
    if classSchedule.CourseID == 0 || classSchedule.UserID == 0 || classSchedule.DayofWeekID == 0 || classSchedule.StudyTimeID == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID, UserID, DayofWeekID, and StudyTimeID are required"})
        fmt.Println("Missing required fields")
        return
    }

    // ตรวจสอบว่า StudyTime มีอยู่ในฐานข้อมูลหรือไม่
    var studyTime entity.StudyTime
    if err := config.DB().First(&studyTime, classSchedule.StudyTimeID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid StudyTimeID"})
        fmt.Printf("StudyTime not found: %v\n", err)
        return
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := config.DB().Debug().Create(&classSchedule).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
        fmt.Printf("Database Error: %v\n", err)
        return
    }

    // โหลดข้อมูล StudyTime เพื่อส่งกลับ
    if err := config.DB().Model(&classSchedule).Association("StudyTime").Find(&studyTime); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load StudyTime data"})
        fmt.Printf("StudyTime Load Error: %v\n", err)
        return
    }

    // ส่งข้อมูลกลับเมื่อบันทึกสำเร็จ
    c.JSON(http.StatusCreated, gin.H{
        "message": "Class schedule saved successfully",
        "data": map[string]interface{}{
            "ClassSchedule": classSchedule,
            "StudyTime":     studyTime,
        },
    })
    fmt.Println("Data saved successfully:", classSchedule)
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