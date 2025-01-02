package controller

import (
	"elearning/config"
	"elearning/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)
func CreateAvailability(c *gin.Context) {
	var availability entity.Availability

	// Bind JSON payload
	if err := c.ShouldBindJSON(&availability); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Save to the database
	db := config.DB()
	if err := db.Create(&availability).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create availability", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Availability created successfully",
		"data":    availability,
	})
}

// POST /appointments
func CreateTeacherAppointment(c *gin.Context) {
	var appointment struct {
		Title              string                    `json:"title"`
		AppointmentDuration int                      `json:"appointment_duration"`
		BufferTime         int                       `json:"buffer_time"`
		MaxBookings        int                       `json:"max_bookings"`
		Location           string                    `json:"location"`
		Description        string                    `json:"description"`
		UserID             uint                      `json:"user_id"`
		DaysAvailability   []entity.Availability     `json:"days_availability"` // รับ days_availability จาก Frontend
	}

	// Bind JSON payload
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Save each day availability
	db := config.DB()
	for _, availability := range appointment.DaysAvailability {
		availability.UserID = appointment.UserID // เชื่อมโยงกับ UserID
		if err := db.Create(&availability).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save availability", "details": err.Error()})
			return
		}
	}

	// Save the appointment
	a := entity.TeacherAppointment{
		Title:              appointment.Title,
		AppointmentDuration: appointment.AppointmentDuration,
		BufferTime:         appointment.BufferTime,
		MaxBookings:        appointment.MaxBookings,
		Location:           appointment.Location,
		Description:        appointment.Description,
		UserID:             appointment.UserID,
	}

	if err := db.Create(&a).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create appointment", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Appointment created successfully",
		"data":    a,
	})
}

