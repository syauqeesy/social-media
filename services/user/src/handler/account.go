package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/syauqeesy/social-media/common"
	"github.com/syauqeesy/social-media/user/src/payload"
)

type AccountHandler interface {
	Register(c echo.Context) error
	Login(c echo.Context) error
}

type accountHandler handler

func (h *accountHandler) Register(c echo.Context) error {
	request := &payload.RegisterRequest{}

	err := c.Bind(request)
	if err != nil {
		return common.WriteFailResponse(c, err, nil)
	}

	result, err := h.Service.Account.Create(c.Request().Context(), request)
	if err != nil {
		return common.WriteFailResponse(c, err, nil)
	}

	return common.WriteSuccessResponse(c, "Register success", result)
}

func (h *accountHandler) Login(c echo.Context) error {
	request := &payload.LoginRequest{}

	err := c.Bind(request)
	if err != nil {
		return common.WriteFailResponse(c, err, nil)
	}

	result, err := h.Service.Account.Login(c.Request().Context(), request)
	if err != nil {
		return common.WriteFailResponse(c, err, nil)
	}

	return common.WriteSuccessResponse(c, "Login success", result)
}
