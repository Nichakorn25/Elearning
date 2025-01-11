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

	fmt.Println("Received Search Query:", searchQuery)
	fmt.Println("Received Semester:", semester)

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
