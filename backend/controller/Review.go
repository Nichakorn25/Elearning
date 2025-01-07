package controller

import (
	"elearning/config"
	"elearning/entity"
	"strconv"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
)

// เพิ่ม Review
func CreateReview(c *gin.Context) {
	var input entity.Review
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่าผู้ใช้และชีทมีอยู่จริง
	var user entity.User
	if err := config.DB().First(&user, input.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var sheet entity.Sheet
	if err := config.DB().First(&sheet, input.SheetID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}

	// ตรวจสอบคะแนน (Rating)
	if input.Rating < 1 || input.Rating > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rating must be between 1 and 5"})
		return
	}

	// บันทึก Review
	input.ReviewDate = time.Now()
	if err := config.DB().Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review created successfully", "review": input})
}

// ดึงข้อมูล Review ทั้งหมด
func GetAllReviews(c *gin.Context) {
	var reviews []entity.Review
	if err := config.DB().Preload("User").Preload("Sheet").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reviews": reviews})
}

// ดึงข้อมูล Review ตาม ID
func GetReviewByID(c *gin.Context) {
	var review entity.Review
	id := c.Param("id")

	if err := config.DB().Preload("User").Preload("Sheet").First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"review": review})
}

// ลบ Review
func DeleteReview(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB().Delete(&entity.Review{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete review"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}


// ดึงข้อมูล Review ทั้งหมดตาม Sheet ID พร้อมคะแนนเฉลี่ย
func GetReviewsBySheetID(c *gin.Context) {
	sheetID, err := strconv.Atoi(c.Param("sheet_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sheet ID"})
		return
	}

	var reviews []entity.Review
	if err := config.DB().Where("sheet_id = ?", sheetID).Preload("User").Order("review_date DESC").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
		return
	}

	var totalRating float32
	for _, review := range reviews {
		totalRating += float32(review.Rating)
	}
	averageRating := float32(0)
	if len(reviews) > 0 {
		averageRating = totalRating / float32(len(reviews))
	}

	c.JSON(http.StatusOK, gin.H{
		"reviews":        reviews,
		"average_rating": averageRating,
	})
}