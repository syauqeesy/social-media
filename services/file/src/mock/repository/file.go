package mock_repository

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/syauqeesy/social-media/file/src/model"
	"gorm.io/gorm"
)

type FileRepository struct {
	mock.Mock
}

func (_m *FileRepository) Insert(ctx context.Context, file *model.FileModel) error {
	args := _m.Called(ctx, file)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}

func (_m *FileRepository) InsertInBatches(ctx context.Context, files []*model.FileModel) error {
	args := _m.Called(ctx, files)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}

func (_m *FileRepository) InsertInBatchesTx(ctx context.Context, tx *gorm.DB, files []*model.FileModel) error {
	args := _m.Called(ctx, tx, files)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}
