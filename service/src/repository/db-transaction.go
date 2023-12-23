package repository

import (
	"context"

	"gorm.io/gorm"
)

func WithTx(ctx context.Context, db *gorm.DB, queriesFunc func(ctx context.Context, tx *gorm.DB) error) error {

	transaction := db.WithContext(ctx).Begin()

	err := queriesFunc(ctx, transaction)
	if err != nil {
		transaction.Rollback()
		return err
	}

	transaction.Commit()

	return nil
}
