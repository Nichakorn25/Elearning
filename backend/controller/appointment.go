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

func CreateTeacherAppointment(c *gin.Context) {
	var Appointment entity.TeacherAppointment

	if err := c.ShouldBindJSON(&Appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	u := entity.TeacherAppointment{
		Title: Appointment.Title,
		AppointmentDuration: Appointment.AppointmentDuration,
		BufferTime: Appointment.BufferTime,
		MaxBookings: Appointment.MaxBookings,
		Location: Appointment.Location,
		Description: Appointment.Description,
		UserID: Appointment.UserID,
		AvailabilityID: Appointment.AvailabilityID,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "post Appointment success", "data": u})
}

// GET /teacher/appointments/:teacherId
func GetTeacherAppointments(c *gin.Context) {
	teacherId := c.Param("teacherId")
	var appointments []entity.TeacherAppointment

	// Query appointments
	if err := config.DB().Where("user_id = ?", teacherId).Find(&appointments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve appointments"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}
