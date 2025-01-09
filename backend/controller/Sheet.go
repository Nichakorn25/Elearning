package controller

import (
	"elearning/config"
	"elearning/entity"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// Get all Sheets
func GetSheets(c *gin.Context) {
	var sheets []entity.Sheet
	if err := config.DB().Preload("Seller").Preload("Course").Preload("Review").Find(&sheets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sheets})
}

func GetSheetsBySellerID(c *gin.Context) {
	var sheets []entity.Sheet
	sellerID := c.Param("sellerID")

	if sellerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SellerID is required"})
		return
	}

	if err := config.DB().
		Where("seller_id = ?", sellerID).
		Preload("Seller").
		Preload("Course").
		Preload("Review").
		Find(&sheets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sheets})
}

// Get Sheet by ID
func GetSheetByID(c *gin.Context) {
	id := c.Param("id")
	var sheet entity.Sheet

	if err := config.DB().Preload("Seller").Preload("Course").Preload("Review").First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sheet})
}

func CreateSheet(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		fmt.Println("File Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please upload a file"})
		return
	}

	uploadDir := "public/uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
	filePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		fmt.Println("File Save Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	relativePath := fmt.Sprintf("/uploads/%s", filename)

	title := c.PostForm("Title")
	description := c.PostForm("Description")
	price := c.PostForm("Price")
	courseID := c.PostForm("CourseID")
	year := c.PostForm("Year")
	sellerID := c.PostForm("SellerID")
	term := c.PostForm("Term")

	priceFloat, err := strconv.ParseFloat(price, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price must be a number"})
		return
	}

	courseIDUint, err := strconv.ParseUint(courseID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID must be a number"})
		return
	}

	yearUint, err := strconv.ParseUint(year, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a number"})
		return
	}

	sellerIDUint, err := strconv.ParseUint(sellerID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SellerID must be a number"})
		return
	}

	sheet := entity.Sheet{
		Title:       title,
		Description: description,
		Price:       float32(priceFloat),
		CourseID:    uint(courseIDUint),
		Year:        uint(yearUint),
		SellerID:    uint(sellerIDUint),
		FilePath:    relativePath,
		Term:        term,
	}

	if err := config.DB().Create(&sheet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the sheet"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": sheet})
}

// Update a Sheet by ID
func UpdateSheet(c *gin.Context) {
	id := c.Param("id")
	var sheet entity.Sheet

	if err := config.DB().First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}

	file, err := c.FormFile("file")
	if err == nil {
		if sheet.FilePath != "" {
			oldFilePath := filepath.Join("public", sheet.FilePath)
			if _, err := os.Stat(oldFilePath); err == nil {
				os.Remove(oldFilePath)
			}
		}

		uploadDir := "public/uploads"
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			os.MkdirAll(uploadDir, os.ModePerm)
		}

		filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
		filePath := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
			return
		}

		relativePath := fmt.Sprintf("/uploads/%s", filename)
		sheet.FilePath = relativePath
	}

	sheet.Title = c.PostForm("Title")
	sheet.Description = c.PostForm("Description")
	price, _ := strconv.ParseFloat(c.PostForm("Price"), 32)
	sheet.Price = float32(price)
	year, _ := strconv.Atoi(c.PostForm("Year"))
	sheet.Year = uint(year)
	sheet.Term = c.PostForm("Term")
	courseID, _ := strconv.Atoi(c.PostForm("CourseID"))
	sheet.CourseID = uint(courseID)

	if err := config.DB().Save(&sheet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update the sheet"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Sheet updated successfully",
		"data":    sheet,
	})
}

// Delete a Sheet by ID
func DeleteSheet(c *gin.Context) {
	id := c.Param("id")
	var sheet entity.Sheet

	if err := config.DB().First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}

	if sheet.FilePath != "" {
		filePath := filepath.Join("public", sheet.FilePath)
		if _, err := os.Stat(filePath); err == nil {
			os.Remove(filePath)
		}
	}

	if err := config.DB().Delete(&sheet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the sheet"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sheet deleted successfully"})
}

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please upload a file"})
		return
	}

	if filepath.Ext(file.Filename) != ".pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only PDF files are supported"})
		return
	}

	uploadDir := "public/uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), filepath.Base(file.Filename))
	filePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	fileURL := fmt.Sprintf("/uploads/%s", filename)

	c.JSON(http.StatusCreated, gin.H{
		"path":    fileURL,
		"message": "File uploaded successfully",
	})
}

func GetCourses(c *gin.Context) {
	var courses []entity.Course
	if err := config.DB().Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": courses})
}
