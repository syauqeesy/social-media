package common

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Response struct {
	Code    int         `json:"code"`
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func WriteSuccessResponse(c echo.Context, message string, data interface{}) error {
	return c.JSON(http.StatusOK, &Response{
		Code:    http.StatusOK,
		Status:  true,
		Message: message,
		Data:    data,
	})
}

func WriteFailResponse(c echo.Context, err error, data interface{}) error {
	var message string = err.Error()
	var httpStatusCode int = 0

	switch convertedError := (err).(type) {
	case *ApplicationError:
		httpStatusCode = convertedError.HttpStatusCode
	default:
		httpStatusCode = http.StatusInternalServerError
		message = http.StatusText(http.StatusInternalServerError)
	}

	return c.JSON(httpStatusCode, &Response{
		Code:    httpStatusCode,
		Status:  false,
		Message: message,
		Data:    data,
	})
}
