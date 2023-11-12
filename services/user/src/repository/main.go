package repository

import (
	"log"

	"github.com/DATA-DOG/go-sqlmock"
	mock_repository "github.com/syauqeesy/social-media/user/src/mock/repository"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type repository struct {
	Database *gorm.DB
}

type Repository struct {
	Account AccountRepository

	DB     *gorm.DB
	DBMock sqlmock.Sqlmock
	Mock   MockRepository
}

type MockRepository struct {
	Account *mock_repository.AccountRepository
}

func NewRepository(Database *gorm.DB) *Repository {
	repository := &repository{
		Database: Database,
	}

	r := &Repository{
		Account: (*accountRepository)(repository),
		DB:      Database,
	}

	return r
}

func GetMockRepository() *Repository {
	mockRepository := MockRepository{
		Account: &mock_repository.AccountRepository{},
	}

	db, dbMock, err := sqlmock.New()
	if err != nil {
		log.Fatal(err)
	}

	gormDB, err := gorm.Open(mysql.New(mysql.Config{
		Conn:                      db,
		DSN:                       "",
		SkipInitializeWithVersion: true,
	}))
	if err != nil {
		log.Fatal(err)
	}

	return &Repository{
		Account: mockRepository.Account,
		DB:      gormDB,
		DBMock:  dbMock,
		Mock:    mockRepository,
	}
}
