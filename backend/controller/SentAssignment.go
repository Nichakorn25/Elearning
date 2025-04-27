package controller

import(
	"time"
	"net/http"
	"example.com/Elearning/config"
   	"example.com/Elearning/entity"
	"github.com/gin-gonic/gin"
	"path/filepath"
	"strconv"
)

func CreateSubmission(c *gin.Context) {

	// ดึงข้อมูลฟอร์มที่แนบมาพร้อมไฟล์
	userID := c.PostForm("user_id")
	assignmentID := c.PostForm("assignment_id")
	fileName := c.PostForm("file_name")

	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("file_path")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please upload a file"})
		return
	}

	// บันทึกไฟล์ลงในโฟลเดอร์ backend/file_teacher
	savePath := filepath.Join("file_submission", filepath.Base(file.Filename))
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	userIDUint, err := strconv.Atoi(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID must be a valid number"})
		return
	}

	assignmentIDUint, err := strconv.Atoi(assignmentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a valid number"})
		return
	}

	submission := entity.Submission{
		SubmissionDate: time.Now(),
		FileName: fileName,
		FilePath: savePath,
		UserID: uint(userIDUint),
		AssignmentID: uint(assignmentIDUint),
	}

	if err := config.DB().Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission": submission})
}


func GetSubmission(c *gin.Context) {
	userID := c.Param("user_id") 
	assignmentID := c.Param("assignment_id") 

	// ค้นหา Submission ที่ตรงกับ userID และ assignmentID
	var submission entity.Submission
	if err := config.DB().
		Where("user_id = ? AND assignment_id = ?", userID, assignmentID). 
		First(&submission).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission": submission})
}


func GetSubmissionAll(c *gin.Context) {
	assignmentID := c.Param("assignment_id")

	var submission []entity.Submission
	if err := config.DB().Where("assignment_id = ?", assignmentID).
						  Find(&submission).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"submission": submission})
}

func UpdateSubmission(c *gin.Context) {
	var submission entity.Submission
	submissionID := c.Param("id")

	db := config.DB()
	result := db.First(&submission, submissionID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&submission)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "submission": submission})
}

func DeleteSubmission(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if tx := db.Exec("DELETE FROM submissions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetGradesAll(c *gin.Context) {
	assignmentID := c.Param("assignment_id")
	var submissions []entity.Submission

	db := config.DB()
	// ดึงข้อมูล Submission ที่มี Grade และอยู่ใน Assignment นั้น
	result := db.Preload("Grade").
		Where("assignment_id = ?", assignmentID).
		Where("id IN (SELECT submission_id FROM grades)").
		Find(&submissions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"assignment_id": assignmentID,
		"submissions":   submissions,
	})
}

func GetGrade(c *gin.Context) {
	submissionID := c.Param("submission_id")
	var grade entity.Grade

	db := config.DB()
	result := db.Where("submission_id = ?", submissionID).First(&grade)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Grade not found for the given submission ID"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"submission_id": submissionID,
		"grade":         grade,
	})
}

func CreateGrade(c *gin.Context) {
	var grade entity.Grade

	if err := c.ShouldBindJSON(&grade); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var submission entity.Submission
	if err := config.DB().First(&submission, grade.SubmissionID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	db := config.DB()
	if err := db.Create(&grade).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create grade"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"grade": grade})
}

func UpdateGrade(c *gin.Context) {
	var grade entity.Grade
	gradeID := c.Param("id")

	db := config.DB()
	if err := db.First(&grade, gradeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Grade not found"})
		return
	}

	if err := c.ShouldBindJSON(&grade); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := db.Save(&grade).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update grade"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"grade": grade})
}