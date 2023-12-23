package common

type ApplicationError struct {
	HttpStatusCode int
	Message        string
}

func (e ApplicationError) Error() string {
	return e.Message
}

func CreateApplicationError(httpStatusCode int, message string) *ApplicationError {
	return &ApplicationError{
		HttpStatusCode: httpStatusCode,
		Message:        message,
	}
}
