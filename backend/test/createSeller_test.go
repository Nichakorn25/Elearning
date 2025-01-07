package unit

import (
	"testing"

	"elearning/entity"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestSellerValidation(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Name is required`, func(t *testing.T) {
		seller := entity.Seller{
			Name:  "", // Invalid: Name is empty
			UserID: 1,
		}

		ok, err := govalidator.ValidateStruct(seller)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("Name is required"))
	})

	t.Run(`UserID is required`, func(t *testing.T) {
		seller := entity.Seller{
			Name:   "Valid Name",
			UserID: 0, // Invalid: UserID is not provided
		}

		ok, err := govalidator.ValidateStruct(seller)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(Equal("UserID is required"))
	})

	t.Run(`Valid Seller`, func(t *testing.T) {
		seller := entity.Seller{
			Name:   "Valid Name",
			UserID: 1, // Valid UserID
		}

		ok, err := govalidator.ValidateStruct(seller)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}
