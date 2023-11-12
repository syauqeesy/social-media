package service

import (
	"github.com/syauqeesy/social-media/user/config"
	"github.com/syauqeesy/social-media/user/src/module"
	"github.com/syauqeesy/social-media/user/src/repository"
)

type service struct {
	Repository *repository.Repository
	Module     *module.Module
	Config     *config.Config
}

type Service struct {
	Account AccountService
}

func NewService(repository *repository.Repository, module *module.Module, config *config.Config) *Service {
	service := &service{
		Repository: repository,
		Module:     module,
		Config:     config,
	}

	s := &Service{
		Account: (*accountService)(service),
	}

	return s
}
