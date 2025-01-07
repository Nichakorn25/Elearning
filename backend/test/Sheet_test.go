package unit

import (
	"testing"

	"elearning/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestSheetValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Missing Title", func(t *testing.T) {
		sheet := entity.Sheet{
			Description:   "This is an example sheet.",
			FilePath:      "https://example.com/file.pdf",
			Price:         99.99,
			Rating:        4.5,
			SellerID:      1,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Title is required"))
	})

	t.Run("Missing Description", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			FilePath:      "https://example.com/file.pdf",
			Price:         99.99,
			Rating:        4.5,
			SellerID:      1,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Description is required"))
	})

	t.Run("Invalid FilePath", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			Description:   "This is an example sheet.",
			FilePath:      "invalid-file-path",
			Price:         99.99,
			Rating:        4.5,
			SellerID:      1,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("FilePath must be a valid URL"))
	})

	t.Run("Invalid Price (Negative)", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			Description:   "This is an example sheet.",
			FilePath:      "https://example.com/file.pdf",
			Price:         -10.0, // Invalid price
			Rating:        4.5,
			SellerID:      1,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Price must be between 0 and 10000"))
	})

	t.Run("Invalid Rating (Out of Range)", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			Description:   "This is an example sheet.",
			FilePath:      "https://example.com/file.pdf",
			Price:         99.99,
			Rating:        6.0, // Invalid rating
			SellerID:      1,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Rating must be between 0 and 5"))
	})

	t.Run("Missing SellerID", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			Description:   "This is an example sheet.",
			FilePath:      "https://example.com/file.pdf",
			Price:         99.99,
			Rating:        4.5,
			CourseID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("SellerID is required"))
	})

	t.Run("Missing CourseID", func(t *testing.T) {
		sheet := entity.Sheet{
			Title:         "Example Sheet",
			Description:   "This is an example sheet.",
			FilePath:      "https://example.com/file.pdf",
			Price:         99.99,
			Rating:        4.5,
			SellerID:      1,
		}

		ok, err := govalidator.ValidateStruct(sheet)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("CourseID is required"))
	})
}
