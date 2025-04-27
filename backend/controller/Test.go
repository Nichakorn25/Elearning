package controller

import (
	"net/http"
	"example.com/Elearning/entity"
    "example.com/Elearning/config"
	"github.com/gin-gonic/gin"
	"time"
)

type CreateTestRequest struct {
	Title          string                   `json:"title" binding:"required"`
	Description    string                   `json:"description" binding:"required"`
	DueDate        string                   `json:"due_date" binding:"required"`
	Timeout        string                   `json:"time_out"`
	CourseID       uint                     `json:"course_id" binding:"required"`
	QuizQuestions  []CreateQuizQuestionRequest `json:"quiz_questions"`
}

type CreateQuizQuestionRequest struct {
	ID            uint                     `json:"id"` 
	QuestionText  string                   `json:"question_text" binding:"required"`
	AnswerOptions []CreateAnswerOptionRequest `json:"answer_options"`
}

type CreateAnswerOptionRequest struct {
	ID         uint   `json:"id"` 
	OptionText string `json:"option_text" binding:"required"`
	IsCorrect  bool   `json:"is_correct"`
}

func CreateTest(c *gin.Context) {
		var req CreateTestRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		dueDate, err := time.Parse("2006-01-02 15:04:05", req.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due date format"})
			return
		}
		var timeout time.Time
		if req.Timeout != "" {
			timeout, err = time.Parse("15:04:05", req.Timeout)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid timeout format"})
				return
			}
		}

		test := entity.Test{
			Title:       req.Title,
			Description: req.Description,
			DueDate:     dueDate,
			Timeout:     timeout,
			CourseID:    req.CourseID,
		}

		for _, qq := range req.QuizQuestions {
			quizQuestion := entity.QuizQuestion{
				QuestionText: qq.QuestionText,
			}

			for _, ao := range qq.AnswerOptions {
				answerOption := entity.AnswerOption{
					OptionText: ao.OptionText,
					IsCorrect:  ao.IsCorrect,
				}
				quizQuestion.AnswerOption = append(quizQuestion.AnswerOption, answerOption)
			}
			test.QuizQuestion = append(test.QuizQuestion, quizQuestion)
		}

		if err := config.DB().Create(&test).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": test})
	
}

func GetTest(c *gin.Context) {
		id := c.Param("id")
		var test entity.Test
		if err := config.DB().Preload("QuizQuestion.AnswerOption").First(&test, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Test not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": test})
	
}

func UpdateTest(c *gin.Context) {
    id := c.Param("id")
    var test entity.Test

    // ค้นหา Test ตาม ID
    if err := config.DB().Preload("QuizQuestion.AnswerOption").First(&test, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Test not found"})
        return
    }

    var req CreateTestRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // อัปเดตข้อมูล Test
    dueDate, err := time.Parse(time.RFC3339, req.DueDate)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due date format"})
        return
    }
    var timeout time.Time
    if req.Timeout != "" {
        timeout, err = time.Parse(time.RFC3339, req.Timeout)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid timeout format"})
            return
        }
    }

    test.Title = req.Title
    test.Description = req.Description
    test.DueDate = dueDate
    test.Timeout = timeout
    test.CourseID = req.CourseID

    // อัปเดต QuizQuestions
    for _, qqReq := range req.QuizQuestions {
        var quizQuestion entity.QuizQuestion
        if err := config.DB().Where("id = ?", qqReq.ID).First(&quizQuestion).Error; err != nil {
            // ถ้าไม่เจอในฐานข้อมูล ให้สร้างใหม่
            quizQuestion = entity.QuizQuestion{
                QuestionText: qqReq.QuestionText,
                TestID:       test.ID,
            }
        } else {
            // ถ้าเจอ ให้แก้ไขข้อมูล
            quizQuestion.QuestionText = qqReq.QuestionText
        }

        // อัปเดต AnswerOptions
        var existingOptions []entity.AnswerOption
        config.DB().Where("question_id = ?", quizQuestion.ID).Find(&existingOptions)

        var updatedOptionIDs []uint
        for _, aoReq := range qqReq.AnswerOptions {
            var answerOption entity.AnswerOption
            if err := config.DB().Where("id = ?", aoReq.ID).First(&answerOption).Error; err != nil {
                // ถ้าไม่เจอในฐานข้อมูล ให้สร้างใหม่
                answerOption = entity.AnswerOption{
                    OptionText: aoReq.OptionText,
                    IsCorrect:  aoReq.IsCorrect,
                    QuestionID: quizQuestion.ID,
                }
                config.DB().Create(&answerOption)
            } else {
                // ถ้าเจอ ให้แก้ไขข้อมูล
                answerOption.OptionText = aoReq.OptionText
                answerOption.IsCorrect = aoReq.IsCorrect
                config.DB().Save(&answerOption)
            }
            updatedOptionIDs = append(updatedOptionIDs, answerOption.ID)
        }

        // ลบ AnswerOptions ที่ไม่มีใน Request
        for _, existingOption := range existingOptions {
            if !contains(updatedOptionIDs, existingOption.ID) {
                config.DB().Delete(&existingOption)
            }
        }

        config.DB().Save(&quizQuestion)
    }

    // บันทึกข้อมูลทั้งหมด
    if err := config.DB().Save(&test).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": test})
}

// Helper function เพื่อตรวจสอบว่า ID มีในรายการหรือไม่
func contains(ids []uint, id uint) bool {
    for _, v := range ids {
        if v == id {
            return true
        }
    }
    return false
}


func DeleteTest(c *gin.Context) {
		id := c.Param("id")
		if err := config.DB().Delete(&entity.Test{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Test deleted successfully"})
	
}

func CreateAnswerStudent(c *gin.Context) {
	var studentAnswer entity.StudentAnswer

	// Bind JSON from request body
	if err := c.ShouldBindJSON(&studentAnswer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid request payload", "error": err.Error()})
		return
	}

	// Check if the QuizQuestion exists
	var quizQuestion entity.QuizQuestion
	if err := config.DB().First(&quizQuestion, studentAnswer.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Question not found"})
		return
	}

	// Check if the User exists
	var user entity.User
	if err := config.DB().First(&user, studentAnswer.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "User not found"})
		return
	}

	// Check if the selected option is correct
	var answerOption entity.AnswerOption
	if err := config.DB().
		Where("id = ? AND question_id = ?", studentAnswer.SelectedOption, studentAnswer.QuestionID).
		First(&answerOption).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Selected option not found or does not belong to the question"})
		return
	}

	// Set the value of Correct field
	if answerOption.IsCorrect {
		studentAnswer.Correct = 1
	} else {
		studentAnswer.Correct = 0
	}

	// Save the StudentAnswer to the database
	if err := config.DB().Create(&studentAnswer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to save answer", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Answer submitted successfully",
		"data":   studentAnswer,
	})
}


func GetStudentAnswersWithScore(c *gin.Context) {
	// Parse user_id and test_id from query parameters
	userID := c.Query("user_id")
	testID := c.Query("test_id")

	// Validate that user_id and test_id are provided
	if userID == "" || testID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "user_id and test_id are required"})
		return
	}

	// Fetch StudentAnswers for the given user and test
	var studentAnswers []entity.StudentAnswer
	if err := config.DB().
		Preload("QuizQuestion").
		Where("user_id = ? AND question_id IN (SELECT id FROM quiz_questions WHERE test_id = ?)", userID, testID).
		Find(&studentAnswers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve student answers", "error": err.Error()})
		return
	}

	// Calculate total score
	var totalScore int
	for _, answer := range studentAnswers {
		var answerOption entity.AnswerOption
		if err := config.DB().
			Where("id = ? AND is_correct = true", answer.SelectedOption).
			First(&answerOption).Error; err == nil {
			// Add the question's points to the total score
			totalScore += answer.QuizQuestion.Point
		}
	}

	// Return the result
	c.JSON(http.StatusOK, gin.H{
		"status":        "success",
		"message":       "Student answers retrieved successfully",
		"total_score":   totalScore,
		"student_answers": studentAnswers,
	})
}



// func GetTestByCourseID(c *gin.Context){
// 	var tests []entity.Test
// 	courseID := c.Param("id") // รับค่า CourseID จาก URL

// 	// Query ข้อมูล test ที่เกี่ยวข้องกับ CourseID
// 	if err := config.DB().Where("course_id = ?", courseID).Find(&tests).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ส่งข้อมูลกลับในรูปแบบ JSON
// 	c.JSON(http.StatusOK, gin.H{"data": tests})
// }

// func CreateTest(c *gin.Context) {
// 	var tests entity.Test

// 	// Bind JSON จาก request body
// 	if err := c.ShouldBindJSON(&tests); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่า CourseID ที่ส่งมาใน request มีอยู่จริงหรือไม่
// 	var course entity.Course
// 	if err := config.DB().First(&course, tests.CourseID).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
// 		return
// 	}

// 	// บันทึก Assignment ลงฐานข้อมูล
// 	if err := config.DB().Create(&tests).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": tests})
// }

// func UpdateTest(c *gin.Context) {
// 	var test entity.Test

// 	// รับ Assignment ID จาก URL
// 	id := c.Param("id")

// 	// ตรวจสอบว่า Test ที่ต้องการแก้ไขมีอยู่หรือไม่
// 	if err := config.DB().First(&test, id).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
// 		return
// 	}

// 	// Bind JSON ข้อมูลใหม่ที่ต้องการอัปเดต
// 	if err := c.ShouldBindJSON(&test); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่า CourseID ใหม่ที่ระบุมีอยู่จริงหรือไม่ (หากมีการเปลี่ยนแปลง)
// 	var course entity.Course
// 	if err := config.DB().First(&course, test.CourseID).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Course not found"})
// 		return
// 	}

// 	// อัปเดตข้อมูล Test
// 	if err := config.DB().Save(&test).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": test})
// }

// func DeleteTest(c *gin.Context) {
// 	var test entity.Test

// 	// รับ Test ID จาก URL
// 	id := c.Param("id")

// 	// ตรวจสอบว่า Test มีอยู่หรือไม่
// 	if err := config.DB().First(&test, id).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
// 		return
// 	}

// 	// ลบ Test ออกจากฐานข้อมูล
// 	if err := config.DB().Delete(&test).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": "Assignment deleted successfully"})
// }