package controller

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/Elearning/entity"
    "example.com/Elearning/config"
)

func GetAssignmentCourseID(c *gin.Context){
	var assignments []entity.Assignment
	courseID := c.Param("id") // รับค่า CourseID จาก URL

	// Query ข้อมูล Assignment ที่เกี่ยวข้องกับ CourseID
	if err := config.DB().Where("course_id = ?", courseID).Find(&assignments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": assignments})

}

func GetAssignmentByIDAndCourseID(c *gin.Context) {
	var assignment entity.Assignment
	courseID := c.Param("id")       // รับค่า CourseID จาก URL
	assignmentID := c.Param("assignment_id") // รับค่า AssignmentID จาก URL

	// Query ข้อมูล Assignment ที่ตรงกับทั้ง CourseID และ AssignmentID
	if err := config.DB().Where("id = ? AND course_id = ?", assignmentID, courseID).First(&assignment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignment not found or does not belong to this course"})
		return
	}

	// ส่งข้อมูลกลับในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{"data": assignment})
}

func CreateAssignment(c *gin.Context) {
	var assignment entity.Assignment

	// Bind JSON จาก request body
	if err := c.ShouldBindJSON(&assignment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("CourseID received: %d\n", assignment.CourseID)

	// ตรวจสอบว่า CourseID ที่ส่งมาใน request มีอยู่จริงหรือไม่
	var course entity.Course
	if err := config.DB().First(&course, assignment.CourseID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
		return
	}

	// บันทึก Assignment ลงฐานข้อมูล
	if err := config.DB().Create(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": assignment})
}


func UpdateAssignment(c *gin.Context) {
	var assignment entity.Assignment

	// รับ Assignment ID จาก URL
	id := c.Param("id")

	// ตรวจสอบว่า Assignment ที่ต้องการแก้ไขมีอยู่หรือไม่
	if err := config.DB().First(&assignment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	// Bind JSON ข้อมูลใหม่ที่ต้องการอัปเดต
	if err := c.ShouldBindJSON(&assignment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่า CourseID ใหม่ที่ระบุมีอยู่จริงหรือไม่ (หากมีการเปลี่ยนแปลง)
	var course entity.Course
	if err := config.DB().First(&course, assignment.CourseID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
		return
	}

	// อัปเดตข้อมูล Assignment
	if err := config.DB().Save(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": assignment})
}

func DeleteAssignment(c *gin.Context) {
	var assignment entity.Assignment

	// รับ Assignment ID จาก URL
	id := c.Param("id")

	// ตรวจสอบว่า Assignment มีอยู่หรือไม่
	if err := config.DB().First(&assignment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	// ลบ Assignment ออกจากฐานข้อมูล
	if err := config.DB().Delete(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Assignment deleted successfully"})
	
}