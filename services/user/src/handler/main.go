package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/syauqeesy/social-media/user/src/middleware"
	"github.com/syauqeesy/social-media/user/src/service"
)

type handler struct {
	Service    *service.Service
	Middleware *middleware.Middleware
}

type Handler struct {
	Account AccountHandler
}

func NewHandler(echo *echo.Echo, service *service.Service, middleware *middleware.Middleware) *Handler {
	handler := &handler{
		Service:    service,
		Middleware: middleware,
	}

	h := &Handler{
		Account: (*accountHandler)(handler),
	}

	v1 := echo.Group("/v1")
	{
		user := v1.Group("/user")
		{
			user.POST("/register", h.Account.Register)
			user.POST("/login", h.Account.Login)
		}
	}

	return h
}
