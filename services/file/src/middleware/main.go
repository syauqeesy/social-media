package middleware

import (
	"github.com/labstack/echo/v4"
	"github.com/syauqeesy/social-media/common"
	"github.com/syauqeesy/social-media/file/config"
)

type JWTMiddleware interface {
	Validate() echo.MiddlewareFunc
	GetUserId(c echo.Context) string
}

type Middleware struct {
	JWT JWTMiddleware
}

func NewMiddleware(config *config.Config) *Middleware {
	jwt := common.NewJWT(config.Application.Secret)

	return &Middleware{
		JWT: jwt,
	}
}
