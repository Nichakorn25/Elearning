package controller

import (
    "net/http"
    "example.com/Elearning/entity"
    "example.com/Elearning/config"
    "github.com/gin-gonic/gin"
)

func GetSemesters(c *gin.Context) {
    var semesters []entity.Semester

    db := config.DB()

    if err := db.Find(&semesters).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, semesters)
}