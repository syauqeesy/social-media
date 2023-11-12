package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/syauqeesy/social-media/file/src/middleware"
	"github.com/syauqeesy/social-media/file/src/service"
)

type handler struct {
	Service    *service.Service
	Middleware *middleware.Middleware
}

type Handler struct {
}

func NewHandler(echo *echo.Echo, service *service.Service, middleware *middleware.Middleware) *Handler {
	// handler := &handler{
	// 	Service:    service,
	// 	Middleware: middleware,
	// }

	h := &Handler{}

	// v1 := echo.Group("/v1")
	// {
	// }

	return h
}
