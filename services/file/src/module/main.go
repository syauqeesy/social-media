package module

import (
	"time"

	"github.com/syauqeesy/social-media/common"
	"github.com/syauqeesy/social-media/file/config"
	mock_module "github.com/syauqeesy/social-media/file/src/mock/module"
)

type JWTModule interface {
	GenerateJWT(duration time.Duration, userId string) (*string, error)
}

type Module struct {
	JWT  JWTModule
	File FileModule

	Mock MockModule
}

type MockModule struct {
	File *mock_module.FileModule
}

type module struct {
	Config *config.Config
}

func NewModule(config *config.Config) *Module {
	module := &module{
		Config: config,
	}

	jwtModule := common.NewJWT(config.Application.Secret)

	m := &Module{
		JWT:  jwtModule,
		File: (*fileModule)(module),
	}

	return m
}

func GetMockModule() *Module {
	mockModule := MockModule{
		File: &mock_module.FileModule{},
	}

	return &Module{
		File: mockModule.File,
		Mock: mockModule,
	}
}
