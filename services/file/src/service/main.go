package service

import (
	"github.com/syauqeesy/social-media/file/config"
	"github.com/syauqeesy/social-media/file/src/module"
	"github.com/syauqeesy/social-media/file/src/repository"
)

type service struct {
	Repository *repository.Repository
	Module     *module.Module
	Config     *config.Config
}

type Service struct {
}

func NewService(repository *repository.Repository, module *module.Module, config *config.Config) *Service {
	// service := &service{
	// 	Repository: repository,
	// 	Module:     module,
	// 	Config:     config,
	// }

	s := &Service{}

	return s
}
