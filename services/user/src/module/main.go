package module

import (
	"time"

	"github.com/syauqeesy/social-media/common"
	"github.com/syauqeesy/social-media/user/config"
)

type JWTModule interface {
	GenerateJWT(duration time.Duration, userId string) (*string, error)
}

type Module struct {
	JWT JWTModule

	Mock MockModule
}

type MockModule struct {
}

type module struct {
	Config *config.Config
}

func NewModule(config *config.Config) *Module {
	jwtModule := common.NewJWT(config.Application.Secret)

	m := &Module{
		JWT: jwtModule,
	}

	return m
}

func GetMockModule() *Module {
	mockModule := MockModule{}

	return &Module{
		Mock: mockModule,
	}
}
