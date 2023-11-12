package mock_repository

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/syauqeesy/social-media/file/src/model"
	"gorm.io/gorm"
)

type FileGroupRepository struct {
	mock.Mock
}

func (_m *FileGroupRepository) Insert(ctx context.Context, fileGroup *model.FileGroupModel) error {
	args := _m.Called(ctx, fileGroup)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}

func (_m *FileGroupRepository) InsertTx(ctx context.Context, tx *gorm.DB, fileGroup *model.FileGroupModel) error {
	args := _m.Called(ctx, tx, fileGroup)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}
