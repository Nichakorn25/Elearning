package controller

import (
    "net/http"
    "elearning/entity"
    "elearning/config"
    "github.com/gin-gonic/gin"
)

func GetDayOfWeek(c *gin.Context) {
    var daysOfWeek []entity.DayofWeek

    db := config.DB()

    if err := db.Find(&daysOfWeek).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, daysOfWeek)
}
