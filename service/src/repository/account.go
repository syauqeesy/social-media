package repository

import (
	"context"
	"errors"

	application_error "github.com/syauqeesy/social-media/src/application-error"

	"github.com/syauqeesy/social-media/src/model"
	"gorm.io/gorm"
)

type AccountRepository interface {
	Insert(ctx context.Context, account *model.AccountModel) error
	SelectByUsername(ctx context.Context, username string) (*model.AccountModel, error)
	SelectById(ctx context.Context, id string) (*model.AccountModel, error)
}

type accountRepository repository

func (r *accountRepository) Insert(ctx context.Context, account *model.AccountModel) error {
	err := r.Database.WithContext(ctx).Create(account).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *accountRepository) SelectByUsername(ctx context.Context, username string) (*model.AccountModel, error) {
	account := &model.AccountModel{}

	err := r.Database.WithContext(ctx).Where("username = ?", username).First(&account).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if err != nil {
		return nil, application_error.ERR_NOT_FOUND_ACCOUNT_USERNAME
	}

	return account, nil
}

func (r *accountRepository) SelectById(ctx context.Context, id string) (*model.AccountModel, error) {
	account := &model.AccountModel{}

	err := r.Database.WithContext(ctx).Where("id = ?", id).First(&account).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if err != nil {
		return nil, application_error.ERR_ACCOUNT_NOT_FOUND
	}

	return account, nil
}
