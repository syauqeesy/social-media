package repository

import (
	"log"

	"github.com/DATA-DOG/go-sqlmock"
	mock_repository "github.com/syauqeesy/social-media/file/src/mock/repository"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type repository struct {
	Database *gorm.DB
}

type Repository struct {
	File      FileRepository
	FileGroup FileGroupRepository

	DB     *gorm.DB
	DBMock sqlmock.Sqlmock
	Mock   MockRepository
}

type MockRepository struct {
	FileGroup *mock_repository.FileGroupRepository
	File      *mock_repository.FileRepository
}

func NewRepository(Database *gorm.DB) *Repository {
	repository := &repository{
		Database: Database,
	}

	r := &Repository{
		File:      (*fileRepository)(repository),
		FileGroup: (*fileGroupRepository)(repository),
		DB:        Database,
	}

	return r
}

func GetMockRepository() *Repository {
	mockRepository := MockRepository{
		FileGroup: &mock_repository.FileGroupRepository{},
		File:      &mock_repository.FileRepository{},
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
		FileGroup: mockRepository.FileGroup,
		File:      mockRepository.File,
		DB:        gormDB,
		DBMock:    dbMock,
		Mock:      mockRepository,
	}
}
