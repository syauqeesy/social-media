package application_error

import (
	"net/http"

	"github.com/syauqeesy/social-media/common"
)

// name errors
var ERR_REQUIRED_ACCOUNT_NAME = common.CreateApplicationError(
	http.StatusBadRequest,
	"name is required",
)
var ERR_MAXIMUM_LENGTH_ACCOUNT_NAME = common.CreateApplicationError(
	http.StatusBadRequest,
	"name cannot be more than 191 characters",
)

// password errors
var ERR_MINIMUM_LENGTH_ACCOUNT_PASSWORD = common.CreateApplicationError(
	http.StatusBadRequest,
	"minimum length for password is 8 characters",
)
var ERR_REQUIRED_ACCOUNT_PASSWORD = common.CreateApplicationError(
	http.StatusBadRequest,
	"password is required",
)
var ERR_WRONG_ACCOUNT_PASSWORD = common.CreateApplicationError(
	http.StatusBadRequest,
	"password is wrong",
)

// email errors
var ERR_ALREADY_USED_ACCOUNT_EMAIL = common.CreateApplicationError(
	http.StatusBadRequest,
	"email already used",
)
var ERR_REQUIRED_ACCOUNT_EMAIL = common.CreateApplicationError(
	http.StatusBadRequest,
	"email is required",
)
var ERR_NOT_FOUND_ACCOUNT_EMAIL = common.CreateApplicationError(
	http.StatusNotFound,
	"email not found",
)

// account errors
var ERR_ACCOUNT_NOT_FOUND = common.CreateApplicationError(
	http.StatusNotFound,
	"account not found",
)
