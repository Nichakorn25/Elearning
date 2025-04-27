package controller

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"example.com/Elearning/config"
	"example.com/Elearning/entity"

	"github.com/gin-gonic/gin"
)

// Get all Sheets
func GetSheets(c *gin.Context) {
	var sheets []entity.Sheet
	if err := config.DB().Preload("Seller").Preload("Course").Preload("Review").Preload("Term").Find(&sheets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sheets})
}
func GetTerms(c *gin.Context) {
	var terms []entity.Term

	// ดึงข้อมูล Term ทั้งหมดจากฐานข้อมูล
	if err := config.DB().Find(&terms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch terms"})
		return
	}

	// ส่งข้อมูล Term กลับ
	c.JSON(http.StatusOK, gin.H{"data": terms})
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
		Preload("Term").
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

	if err := config.DB().Preload("Seller").Preload("Course").Preload("Review").Preload("Term").First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": sheet})
}

func CreateSheet(c *gin.Context) {
	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please upload a file"})
		return
	}

	// ตรวจสอบและสร้างไดเรกทอรีอัปโหลด
	uploadDir := "public/uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create upload directory"})
			return
		}
	}

	// สร้างชื่อไฟล์ใหม่
	filename := fmt.Sprintf("%s-%s", time.Now().In(time.FixedZone("Asia/Bangkok", 7*60*60)).Format("20060102-150405"), file.Filename)
	filePath := filepath.Join(uploadDir, filename)

	// บันทึกไฟล์ลงในเซิร์ฟเวอร์
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	// สร้างเส้นทางไฟล์แบบสัมพันธ์
	relativePath := fmt.Sprintf("/uploads/%s", filename)
	relativePath = strings.Replace(relativePath, "/", "\\", -1)

	// รับค่าจากฟอร์ม
	title := c.PostForm("Title")
	description := c.PostForm("Description")
	price := c.PostForm("Price")
	courseID := c.PostForm("CourseID")
	year := c.PostForm("Year")
	sellerID := c.PostForm("SellerID")
	termID := c.PostForm("TermID")

	// ตรวจสอบค่าที่จำเป็น
	if title == "" || description == "" || price == "" || courseID == "" || year == "" || sellerID == "" || termID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	// แปลงค่าที่ต้องเป็นตัวเลข
	priceFloat, err := strconv.ParseFloat(price, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price must be a valid number"})
		return
	}

	courseIDUint, err := strconv.ParseUint(courseID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID must be a valid number"})
		return
	}

	yearUint, err := strconv.ParseUint(year, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a valid number"})
		return
	}

	sellerIDUint, err := strconv.ParseUint(sellerID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SellerID must be a valid number"})
		return
	}

	termIDUint, err := strconv.ParseUint(termID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TermID must be a valid number"})
		return
	}

	// สร้าง Sheet ใหม่
	sheet := entity.Sheet{
		Title:       title,
		Description: description,
		Price:       float32(priceFloat),
		CourseID:    uint(courseIDUint),
		Year:        uint(yearUint),
		SellerID:    uint(sellerIDUint),
		FilePath:    relativePath,
		TermID:      uint(termIDUint),
	}

	// บันทึก Sheet ลงฐานข้อมูล
	if err := config.DB().Create(&sheet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the sheet"})
		return
	}

	// ส่งข้อมูลกลับ
	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Sheet created successfully",
		"data":    sheet,
	})
}

// Update a Sheet by ID
func UpdateSheet(c *gin.Context) {
	id := c.Param("id")
	var sheet entity.Sheet

	// ค้นหา Sheet จาก ID
	if err := config.DB().First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}

	// ตรวจสอบและอัปโหลดไฟล์ใหม่ (ถ้ามี)
	file, err := c.FormFile("file")
	if err == nil { // ถ้ามีไฟล์ที่ส่งมา
		// ลบไฟล์เก่า (ถ้ามี)
		if sheet.FilePath != "" {
			oldFilePath := filepath.Join("public", filepath.FromSlash(sheet.FilePath))
			if _, err := os.Stat(oldFilePath); err == nil {
				if err := os.Remove(oldFilePath); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete old file"})
					return
				}
			}
		}

		// อัปโหลดไฟล์ใหม่
		uploadDir := filepath.Join("public", "uploads")
		if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
			os.MkdirAll(uploadDir, os.ModePerm)
		}

		filename := fmt.Sprintf("%s-%s", time.Now().In(time.FixedZone("Asia/Bangkok", 7*60*60)).Format("20060102-150405"), file.Filename)
		filePath := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
			return
		}

		relativePath := fmt.Sprintf("/uploads/%s", filename)
		sheet.FilePath = strings.Replace(relativePath, "/", "\\", -1)
	}

	// อัปเดตข้อมูลใน Sheet
	title := c.PostForm("Title")
	description := c.PostForm("Description")
	price := c.PostForm("Price")
	year := c.PostForm("Year")
	courseID := c.PostForm("CourseID")
	termID := c.PostForm("TermID")

	if title != "" {
		sheet.Title = title
	}

	if description != "" {
		sheet.Description = description
	}

	if price != "" {
		priceFloat, err := strconv.ParseFloat(price, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Price must be a valid number"})
			return
		}
		sheet.Price = float32(priceFloat)
	}

	if year != "" {
		yearUint, err := strconv.Atoi(year)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a valid number"})
			return
		}
		sheet.Year = uint(yearUint)
	}

	if courseID != "" {
		courseIDUint, err := strconv.Atoi(courseID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "CourseID must be a valid number"})
			return
		}
		sheet.CourseID = uint(courseIDUint)
	}

	if termID != "" {
		termIDUint, err := strconv.Atoi(termID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "TermID must be a valid number"})
			return
		}
		sheet.TermID = uint(termIDUint)
	}

	// บันทึกการอัปเดตลงในฐานข้อมูล
	if err := config.DB().Save(&sheet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update the sheet"})
		return
	}

	c.JSON(http.StatusOK, sheet)
}

// Delete a Sheet by ID
func DeleteSheet(c *gin.Context) {
	id := c.Param("id")
	var sheet entity.Sheet

	// หาข้อมูล sheet จากฐานข้อมูล
	if err := config.DB().First(&sheet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sheet not found"})
		return
	}

	// ใช้ Soft Delete โดยการตั้งค่า DeletedAt
	if err := config.DB().Model(&sheet).Update("DeletedAt", time.Now()).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark sheet as deleted"})
		return
	}

	// ส่งข้อมูลที่ถูก soft delete กลับไป
	c.JSON(http.StatusOK, sheet)
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
func GetPurchasedFiles(c *gin.Context) {
	userID := c.Param("userID") // รับ UserID จาก parameter

	var purchases []entity.Purchase
	// Preload Cart, CartItem, Sheet และ Seller
	if err := config.DB().
		Unscoped().
		Preload("Cart.CartItem.Sheet").
		Preload("Cart.CartItem.Sheet.Seller"). // Preload Seller ที่เกี่ยวข้องกับ Sheet
		Preload("Cart.CartItem.Sheet.Course").
		Preload("Cart.CartItem.Sheet.Term").
		Where("user_id = ?", userID).
		Find(&purchases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch purchased files"})
		return
	}

	// เตรียมข้อมูล purchasedFiles
	var purchasedFiles []gin.H
	for _, purchase := range purchases {
		for _, cartItem := range purchase.Cart.CartItem {
			// ใช้ข้อมูลจากตอนที่ซื้อหรือข้อมูลเดิม ไม่ต้องการอัพเดทตามการแก้ไขใน Sheet
			purchasedFiles = append(purchasedFiles, gin.H{
				"sheetID":     cartItem.Sheet.ID,
				"CourseCode":  cartItem.Sheet.Course.CourseCode,
				"title":       cartItem.Sheet.Title,  // ใช้ข้อมูลที่ซื้อครั้งแรก
				"description": cartItem.Sheet.Description,  // ใช้ข้อมูลที่ซื้อครั้งแรก
				"term":        cartItem.Sheet.Term.TermName,
				"year":        cartItem.Sheet.Year,
				"fileURL":     cartItem.Sheet.FilePath,
				"seller":      cartItem.Sheet.Seller.Name, // ดึงชื่อ Seller
				"sellerID":    cartItem.Sheet.Seller.ID,   // ดึง ID ของ Seller
				"sellerName":  cartItem.Sheet.Seller.Name,
			})
		}
	}

	// ส่งข้อมูลกลับ
	c.JSON(http.StatusOK, gin.H{"data": purchasedFiles})
}