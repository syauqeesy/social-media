package service

import (
	"context"
	"errors"
	"time"

	application_error "github.com/syauqeesy/social-media/user/src/application-error"
	"github.com/syauqeesy/social-media/user/src/model"
	"github.com/syauqeesy/social-media/user/src/payload"
	"gorm.io/gorm"
)

type AccountService interface {
	Create(ctx context.Context, request *payload.RegisterRequest) (*payload.AccountInfo, error)
	Login(ctx context.Context, request *payload.LoginRequest) (*payload.AuthenticationTokenResponse, error)
}

type accountService service

func (s *accountService) Create(ctx context.Context, request *payload.RegisterRequest) (*payload.AccountInfo, error) {
	existingAccount, err := s.Repository.Account.SelectByEmail(ctx, request.Email)
	if err != nil && !errors.Is(err, application_error.ERR_NOT_FOUND_ACCOUNT_EMAIL) {
		return nil, err
	}

	if existingAccount != nil {
		return nil, application_error.ERR_ALREADY_USED_ACCOUNT_EMAIL
	}

	account, err := model.CreateAccountModel(request.Name, request.Email, request.Password)
	if err != nil {
		return nil, err
	}

	err = s.Repository.Account.Insert(ctx, account)
	if err != nil {
		return nil, err
	}

	return account.GetPublicInfo(), nil
}

func (s *accountService) Login(ctx context.Context, request *payload.LoginRequest) (*payload.AuthenticationTokenResponse, error) {
	account, err := s.Repository.Account.SelectByEmail(ctx, request.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if account == nil {
		return nil, application_error.ERR_ACCOUNT_NOT_FOUND
	}

	if err := account.ComparePassword(request.Password); err != nil {
		return nil, err
	}

	response := &payload.AuthenticationTokenResponse{}

	token, err := s.Module.JWT.GenerateJWT(time.Hour, account.Id)
	if err != nil {
		return nil, err
	}

	response.AuthenticationToken = *token

	return response, nil
}
