package controller

import(
	"time"
	"net/http"
	"elearning/config"
	"elearning/entity"
	"github.com/gin-gonic/gin"
)

func GetSubmissionWithAttachment(c *gin.Context) {
	// รับค่า userID และ assignmentID จาก URL parameter
	userID := c.Param("user_id") // รับ user_id
	assignmentID := c.Param("assignment_id") // รับ assignment_id

	// ค้นหา Submission ที่ตรงกับ userID และ assignmentID
	var submission entity.Submission
	if err := config.DB().Preload("Attachment"). // ใช้ Preload เพื่อโหลดข้อมูล Attachment ที่สัมพันธ์กับ Submission
		Where("user_id = ? AND assignment_id = ?", userID, assignmentID). // ค้นหาโดยใช้ userID และ assignmentID
		First(&submission).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	// ส่งข้อมูลกลับ (รวมข้อมูล Submission และ Attachment)
	c.JSON(http.StatusOK, gin.H{
		"submission": submission,
		"attachment": submission.Attachment,
	})
}


func GetSubmissionWithAttachmentAll(c *gin.Context) {
	assignmentID := c.Param("assignment_id")

	// ค้นหา Submission พร้อมกับ Attachment ที่เกี่ยวข้อง
	var submission []entity.Submission
	if err := config.DB().Preload("Attachment").
						  Where("assignment_id = ?", assignmentID).
						  Find(&submission).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	// ส่งข้อมูลกลับ
	c.JSON(http.StatusOK, gin.H{
		"submission": submission,
	})
}

func CreateSubmissionWithAttachment(c *gin.Context) {
	// ใช้ entity.Submission เป็นโครงสร้างสำหรับรับข้อมูล
	var submission entity.Submission

	// รับค่าจาก Frontend และ Bind JSON เข้ากับ Submission
	if err := c.ShouldBindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบ Assignment ที่เกี่ยวข้อง
	var assignment entity.Assignment
	if err := config.DB().First(&assignment, submission.AssignmentID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignment not found"})
		return
	}

	// ตั้งค่าเวลา SubmissionDate
	if submission.SubmissionDate.IsZero() {
		submission.SubmissionDate = time.Now()
	}

	// บันทึก Submission
	if err := config.DB().Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// เชื่อม Attachment กับ Submission ที่สร้างใหม่
	submission.Attachment.SubmissionID = submission.ID

	// บันทึก Attachment (ไม่ต้องส่ง ID ในข้อมูลที่รับ)
	if err := config.DB().Create(&submission.Attachment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับ
	c.JSON(http.StatusOK, gin.H{
		"submission":  submission,
		"attachment": submission.Attachment,
	})
}

func UpdateSubmissionWithAttachment(c *gin.Context) {
	submissionID := c.Param("id")
	var submission entity.Submission

	// ค้นหา Submission ที่ต้องการอัปเดตจากฐานข้อมูล
	if err := config.DB().First(&submission, submissionID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	// ตรวจสอบว่ามีไฟล์ที่ส่งมาหรือไม่
	file, err := c.FormFile("file")
	if err == nil {
		// มีไฟล์ใหม่ -> บันทึกไฟล์ใหม่
		filePath := "./uploads/" + file.Filename
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}

		// ค้นหา Attachment ที่เกี่ยวข้องกับ Submission
		var attachment entity.Attachment
		if err := config.DB().First(&attachment, "submission_id = ?", submission.ID).Error; err == nil {
			// อัปเดต Attachment เดิม
			attachment.FileName = file.Filename
			attachment.FilePath = filePath
			if err := config.DB().Save(&attachment).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update attachment"})
				return
			}
		} else {
			// หากไม่มี Attachment ให้สร้างใหม่
			newAttachment := entity.Attachment{
				FileName:     file.Filename,
				FilePath:     filePath,
				SubmissionID: submission.ID,
			}
			if err := config.DB().Create(&newAttachment).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create attachment"})
				return
			}
			submission.Attachment = newAttachment
		}
	}

	// อัปเดตวันที่ส่งงาน
	submission.SubmissionDate = time.Now()

	// บันทึกการอัปเดต Submission
	if err := config.DB().Save(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับไปยัง Frontend
	c.JSON(http.StatusOK, gin.H{
		"updated":    true,
		"submission": submission,
		"attachment": submission.Attachment,
	})
}

func DeleteSubmission(c *gin.Context) {
	// รับ SubmissionID จาก URL parameter
	submissionID := c.Param("id")

	// ค้นหา Submission ที่ต้องการลบจากฐานข้อมูล
	var submission entity.Submission
	if err := config.DB().First(&submission, submissionID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Submission not found"})
		return
	}

	// ลบ Attachment ที่เชื่อมโยงกับ Submission
	if err := config.DB().Where("submission_id = ?", submission.ID).Delete(&entity.Attachment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ลบ Submission
	if err := config.DB().Delete(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับ
	c.JSON(http.StatusOK, gin.H{
		"message": "Submission and attachment deleted successfully",
	})
}




// func CreateSubmission(c *gin.Context) {
// 	var submission entity.Submission

// 	// Bind JSON จาก request body
// 	if err := c.ShouldBindJSON(&submission); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่า CourseID ที่ส่งมาใน request มีอยู่จริงหรือไม่
// 	var course entity.Course
// 	if err := config.DB().First(&course, assignment.CourseID).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
// 		return
// 	}

// 	// บันทึก Assignment ลงฐานข้อมูล
// 	if err := config.DB().Create(&submission).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": submission})
// }