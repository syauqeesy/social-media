package mock_repository

import (
	"context"

	"github.com/stretchr/testify/mock"
	"github.com/syauqeesy/social-media/user/src/model"
)

type AccountRepository struct {
	mock.Mock
}

func (_m *AccountRepository) Insert(ctx context.Context, user *model.AccountModel) error {
	args := _m.Called(ctx, user)

	if args.Get(0) != nil {
		return args.Get(0).(error)
	}

	return nil
}

func (_m *AccountRepository) SelectByEmail(ctx context.Context, email string) (*model.AccountModel, error) {
	args := _m.Called(ctx, email)

	if args.Get(1) != nil {
		return nil, args.Get(1).(error)
	}

	return args.Get(0).(*model.AccountModel), nil
}

func (_m *AccountRepository) SelectById(ctx context.Context, id string) (*model.AccountModel, error) {
	args := _m.Called(ctx, id)

	if args.Get(1) != nil {
		return nil, args.Get(1).(error)
	}

	return args.Get(0).(*model.AccountModel), nil
}
