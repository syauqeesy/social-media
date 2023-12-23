package application_error

import (
	"net/http"

	"github.com/syauqeesy/social-media/common"
)

// original name errors
var ERR_MAXIMUM_LENGTH_FILE_ORIGINAL_NAME = common.CreateApplicationError(
	http.StatusBadRequest,
	"file original name cannot be more than 191 characters",
)
var ERR_REQUIRED_FILE_ORIGINAL_NAME = common.CreateApplicationError(
	http.StatusBadRequest,
	"file original name required",
)

// file type errors
var ERR_FILE_IMAGE_TYPE = common.CreateApplicationError(
	http.StatusBadRequest,
	"file must be an image",
)
