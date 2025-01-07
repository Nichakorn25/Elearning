package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"elearning/entity"
    "elearning/config"
)

// POST /announcements
func CreateAnnouncement(c *gin.Context) {
	var announcement entity.Announcement

	db := config.DB()

	// Bind JSON payload to the announcement entity
	if err := c.ShouldBindJSON(&announcement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if announcement.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}	

	// Check if announce_date is zero (invalid)
	if announcement.AnnounceDate.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid announce date"})
		return
	}

	a := entity.Announcement{
		Title:        announcement.Title,
		Content:      announcement.Content,
		UserID:       announcement.UserID,
		AnnounceDate: announcement.AnnounceDate,
		
	}

	// Save the announcement to the database
	if err := db.Create(&a).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Announcement created successfully", "data": a})
}


// GET /announcements/:id
func GetAnnouncement(c *gin.Context) {
	id := c.Param("id")
	var announcement entity.Announcement

	db := config.DB()

	// Find the announcement by ID
	result := db.First(&announcement, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Announcement not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, announcement)
}

// GET /announcements
func ListAnnouncements(c *gin.Context) {
	var announcements []entity.Announcement

	db := config.DB()

	// Retrieve all announcements
	result := db.Find(&announcements)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, announcements)
}

// PATCH /announcements/:id
func UpdateAnnouncement(c *gin.Context) {
	id := c.Param("id")
	var announcement entity.Announcement

	db := config.DB()

	// Find the existing announcement
	result := db.First(&announcement, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Announcement not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	// Bind updated data to the announcement entity
	if err := c.ShouldBindJSON(&announcement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Save changes to the database
	if err := db.Save(&announcement).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement updated successfully", "data": announcement})
}

// DELETE /announcements/:id
func DeleteAnnouncement(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// Delete the announcement by ID
	result := db.Delete(&entity.Announcement{}, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Announcement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Announcement deleted successfully"})
}