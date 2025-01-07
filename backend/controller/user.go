package controller

import (
	"elearning/config"
	"elearning/entity"
	"strconv"
	"errors" // เพิ่ม import สำหรับ package errors
	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
	"net/http"
	"time"         // สำหรับใช้กับการสร้าง timestamp
    "path/filepath" // สำหรับจัดการ path ของไฟล์
    "fmt"          // สำหรับจัดการ string formatting
    "os"         
)

// POST /users
func CreateUser(c *gin.Context) {
	var user entity.User

	db := config.DB()

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(user.Password)

	// สร้าง User
	u := entity.User{
		Username:     user.Username,
		Password:     hashedPassword,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		Phone:        user.Phone,
		DepartmentID: user.DepartmentID,
		MajorID:      user.MajorID,
		RoleID:       user.RoleID,
		Status: 	  user.Status,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET /user/:id
func GetUser(c *gin.Context) {
    ID := c.Param("id")
    var user entity.User

    db := config.DB()

    // ดึงข้อมูลของผู้ใช้ (User) จากฐานข้อมูล
    result := db.Preload("Department").
        Preload("Major").
        Preload("Major.Department").
        Preload("Role").
        Where("id = ?", ID).
        First(&user)

    if result.Error != nil {
        if errors.Is(result.Error, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        }
        return
    }

    // ตรวจสอบว่า ProfilePicture มีหรือไม่โดยดึงจากตาราง ProfilePicture
    var profilePicture entity.ProfilePicture
    pictureResult := db.Where("user_id = ?", ID).First(&profilePicture)

    if pictureResult.Error != nil {
        if errors.Is(pictureResult.Error, gorm.ErrRecordNotFound) {
            // ถ้าไม่พบรูปโปรไฟล์ให้คืนค่าเป็น null หรือข้อมูลที่เหมาะสม
            user.ProfilePicture = nil
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": pictureResult.Error.Error()})
            return
        }
    } else {
        user.ProfilePicture = []entity.ProfilePicture{profilePicture}
    }

    // ส่งข้อมูลที่รวม ProfilePicture กลับไปยัง client
    c.JSON(http.StatusOK, user)
}


// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.User

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Preload("Department").Preload("Major").Preload("Major.Department").Preload("Role").Select("id, username, password, first_name, last_name, email, phone, department_id, major_id, role_id, status").Find(&users)
	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}

// GET http://localhost:8000/users/filter?departmentId=4&majorId=16&roleId=2
// func ListUsersFilters(c *gin.Context) {
//     var users []entity.User

//     // ดึงค่าจาก Query Parameters
//     departmentId := c.Query("departmentId")
//     majorId := c.Query("majorId")
//     roleId := c.Query("roleId")

//     // Query โดยใช้เงื่อนไข
//     db := config.DB()
//     results := db.Preload("Department").
//         Preload("Major").
//         Preload("Role").
//         Where("department_id = ? AND major_id = ? AND role_id = ?", departmentId, majorId, roleId).
//         Find(&users)

//     if results.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, users)
// }




// func ListUsers(c *gin.Context) {
// 	var users []entity.User

// 	db := config.DB()

// 	if err := db.Find(&users).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, users)

// }

// ดึงข้อมูลผู้ใช้ตาม RoleID, DepartmentID และ MajorID
// func GetUsersByFilters(c *gin.Context) {
//     // ดึงค่าจาก Query Parameters
//     roleID := c.Query("RoleID")
//     departmentID := c.Query("DepartmentID")
//     majorID := c.Query("MajorID")

//     // กำหนดตัวแปรสำหรับเก็บข้อมูลผู้ใช้
//     var users []entity.User

//     // เริ่มการ Query
//     db := config.DB()
//     query := db.Preload("Department").Preload("Major").Where("role_id = ?", roleID)

//     // เพิ่มเงื่อนไขถ้ามี departmentID
//     if departmentID != "" {
//         query = query.Where("department_id = ?", departmentID)
//     }

//     // เพิ่มเงื่อนไขถ้ามี majorID
//     if majorID != "" {
//         query = query.Where("major_id = ?", majorID)
//     }

//     // ค้นหาข้อมูล
//     results := query.Find(&users)
//     if results.Error != nil {
//         if errors.Is(results.Error, gorm.ErrRecordNotFound) {
//             // ถ้าไม่พบข้อมูล
//             c.JSON(http.StatusNotFound, gin.H{"error": "Users not found"})
//         } else {
//             // ถ้าเกิดข้อผิดพลาดอื่นๆ
//             c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
//         }
//         return
//     }

//     // ส่งข้อมูลกลับในรูปแบบ JSON
//     c.JSON(http.StatusOK, users)
// }

// GET http://localhost:8000/users/filter?departmentId=4&majorId=16&roleId=2
func ListUsersFilters(c *gin.Context) {
    var users []entity.User

    // ดึงค่าจาก Query Parameters
    departmentId := c.Query("departmentId")
    majorId := c.Query("majorId")
    roleId := c.Query("roleId")

    // Query โดยใช้เงื่อนไข
    db := config.DB()
    results := db.Preload("Department").
        Preload("Major").
        Preload("Role").
        Where("department_id = ? AND major_id = ? AND role_id = ?", departmentId, majorId, roleId).
        Find(&users)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, users)
}

// SearchProfessors - ค้นหาชื่ออาจารย์จากคำค้นหา
func SearchProfessors(c *gin.Context) {
	searchQuery := c.Query("filter")
	var professors []entity.User
	db := config.DB()

	// ค้นหาเฉพาะ RoleID = 2 (อาจารย์) และค้นหาจาก FirstName หรือ LastName
	results := db.Where("role_id = ? AND (first_name LIKE ? OR last_name LIKE ?)", 2, "%"+searchQuery+"%", "%"+searchQuery+"%").Find(&professors)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, professors)
}




// func GetProfessorsByFilters(c *gin.Context) {
// 	// ดึงค่าจาก Query Parameters
// 	roleID := c.Query("RoleID")
// 	departmentID := c.Query("DepartmentID")
// 	majorID := c.Query("MajorID")
// 	searchQuery := c.Query("SearchQuery")

// 	// ตัวแปรสำหรับเก็บข้อมูลผู้ใช้
// 	var professors []entity.User

// 	// เริ่มการ Query
// 	db := config.DB()
// 	query := db.Preload("Department").Preload("Major").Where("role_id = ?", roleID)

// 	// เพิ่มเงื่อนไขถ้ามี departmentID
// 	if departmentID != "" {
// 		query = query.Where("department_id = ?", departmentID)
// 	}

// 	// เพิ่มเงื่อนไขถ้ามี majorID
// 	if majorID != "" {
// 		query = query.Where("major_id = ?", majorID)
// 	}

// 	// เพิ่มเงื่อนไขการค้นหาชื่อหรือชื่อสกุล
// 	if searchQuery != "" {
// 		query = query.Where("first_name LIKE ? OR last_name LIKE ?", "%"+searchQuery+"%", "%"+searchQuery+"%")
// 	}

// 	// ค้นหาข้อมูล
// 	if err := query.Find(&professors).Error; err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			// ถ้าไม่พบข้อมูล
// 			c.JSON(http.StatusNotFound, gin.H{"error": "No professors found"})
// 		} else {
// 			// ถ้าเกิดข้อผิดพลาดอื่นๆ
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		}
// 		return
// 	}

// 	// ส่งข้อมูลกลับในรูปแบบ JSON
// 	c.JSON(http.StatusOK, professors)
// }


// DELETE /users/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// Delete the user by ID
	result := db.Delete(&entity.User{}, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})

}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.User

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PUT update user ใช้อันนี้นะจ๊ะ
func UpdateUserByid(c *gin.Context) {
    var user entity.User
    var payload struct {
        FirstName    string `form:"FirstName" json:"FirstName"`
        LastName     string `form:"LastName" json:"LastName"`
        Email        string `form:"Email" json:"Email"`
        Phone        string `form:"Phone" json:"Phone"`
        DepartmentID string `form:"DepartmentID" json:"DepartmentID"`
        MajorID      string `form:"MajorID" json:"MajorID"`
        RoleID       string `form:"RoleID" json:"RoleID"`
        Status       string `form:"Status" json:"Status"`
    }

    UserID := c.Param("id")
    db := config.DB()

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    result := db.First(&user, UserID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Bind JSON payload เพื่ออ่านค่า status
    if err := c.ShouldBind(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    // ตรวจสอบค่า status ว่าเป็นค่าที่ถูกต้องหรือไม่ (Active, Inactive)
    if payload.Status != "Active" && payload.Status != "Inactive" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
        return
    }

    // รับไฟล์รูปภาพจาก form-data ถ้ามี
    file, err := c.FormFile("ProfilePicture")
    if err == nil {
        // สร้างชื่อไฟล์ใหม่
        uploadPath := "./uploads"
        timestamp := time.Now().Unix()
        extension := filepath.Ext(file.Filename)
        newFileName := fmt.Sprintf("profile_%d%s", timestamp, extension)
        fileSavePath  := filepath.Join(uploadPath, newFileName)
		profilePicturePath := fmt.Sprintf("/uploads/%s", newFileName)

        // บันทึกไฟล์ใหม่
        if err := c.SaveUploadedFile(file, fileSavePath ); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file", "status": 500})
            return
        }

        // ตรวจสอบว่ามีรูปภาพเดิมอยู่หรือไม่
		var profilePicture entity.ProfilePicture
		err = db.Where("user_id = ?", user.ID).Take(&profilePicture).Error
		if err == nil {
			// ลบไฟล์รูปภาพเก่าจากระบบ
			oldFilePath := fmt.Sprintf(".%s", profilePicture.FilePath)
			os.Remove(oldFilePath)

			// อัปเดต path ของรูปภาพใหม่
			profilePicture.FilePath = profilePicturePath
			if err := db.Save(&profilePicture).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture", "status": 500})
				return
			}
		} else if errors.Is(err, gorm.ErrRecordNotFound) {
			// ถ้าไม่มีข้อมูลเดิม ให้สร้างใหม่ (ไม่ถือว่าเป็นข้อผิดพลาด)
			profilePicture = entity.ProfilePicture{
				UserID:   user.ID,
				FilePath: profilePicturePath,
			}
			if err := db.Create(&profilePicture).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create profile picture", "status": 500})
				return
			}
		} else {
			// หากเกิดข้อผิดพลาดอื่น ๆ ที่ไม่ใช่ record not found
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query profile picture", "status": 500})
			return
		}
	}

    // อัปเดตฟิลด์อื่น ๆ ถ้ามีการส่งค่าเข้ามา
    if payload.FirstName != "" {
        user.FirstName = payload.FirstName
    }
    if payload.LastName != "" {
        user.LastName = payload.LastName
    }
    if payload.Email != "" {
        user.Email = payload.Email
    }
    if payload.Phone != "" {
        user.Phone = payload.Phone
    }

    if payload.DepartmentID != "" {
        departmentID, err := strconv.ParseUint(payload.DepartmentID, 10, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DepartmentID"})
            return
        }
        user.DepartmentID = uint(departmentID)
    }

    if payload.MajorID != "" {
        majorID, err := strconv.ParseUint(payload.MajorID, 10, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid MajorID"})
            return
        }
        user.MajorID = uint(majorID)
    }

    if payload.RoleID != "" {
        roleID, err := strconv.ParseUint(payload.RoleID, 10, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RoleID"})
            return
        }
        user.RoleID = uint(roleID)
    }

    user.Status = payload.Status
    result = db.Save(&user)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}
