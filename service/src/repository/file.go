package repository

import (
	"context"

	"github.com/syauqeesy/social-media/src/model"
	"gorm.io/gorm"
)

type FileRepository interface {
	Insert(ctx context.Context, file *model.FileModel) error
	InsertInBatches(ctx context.Context, files []*model.FileModel) error
	InsertInBatchesTx(ctx context.Context, tx *gorm.DB, files []*model.FileModel) error
}

type fileRepository repository

func (r *fileRepository) Insert(ctx context.Context, file *model.FileModel) error {
	err := r.Database.WithContext(ctx).Create(file).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *fileRepository) InsertInBatches(ctx context.Context, files []*model.FileModel) error {
	err := r.Database.WithContext(ctx).CreateInBatches(files, 25).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *fileRepository) InsertInBatchesTx(ctx context.Context, tx *gorm.DB, files []*model.FileModel) error {
	err := tx.WithContext(ctx).CreateInBatches(files, 25).Error
	if err != nil {
		return err
	}

	return nil
}
