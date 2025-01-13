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
	searchQuery := c.Query("filter")
	semester := c.Query("semester")

	// fmt.Println("Received Search Query:", searchQuery)
	// fmt.Println("Received Semester:", semester)

	var courses []entity.Course
	db := config.DB()

	results := db.Where("semester_id = ? AND course_name LIKE ?", semester, "%"+searchQuery+"%").Find(&courses)

	if results.Error != nil {
		fmt.Println("Database Error:", results.Error.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
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

