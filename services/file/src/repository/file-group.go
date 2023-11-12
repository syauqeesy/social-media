package repository

import (
	"context"

	"github.com/syauqeesy/social-media/file/src/model"
	"gorm.io/gorm"
)

type FileGroupRepository interface {
	Insert(ctx context.Context, fileGroup *model.FileGroupModel) error
	InsertTx(ctx context.Context, tx *gorm.DB, fileGroup *model.FileGroupModel) error
}

type fileGroupRepository repository

func (r *fileGroupRepository) Insert(ctx context.Context, fileGroup *model.FileGroupModel) error {
	err := r.Database.WithContext(ctx).Create(fileGroup).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *fileGroupRepository) InsertTx(ctx context.Context, tx *gorm.DB, fileGroup *model.FileGroupModel) error {
	err := tx.WithContext(ctx).Create(fileGroup).Error
	if err != nil {
		return err
	}

	return nil
}
