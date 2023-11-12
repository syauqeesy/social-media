package model

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	application_error "github.com/syauqeesy/social-media/user/src/application-error"
)

func Test_AccountModel_TableName(t *testing.T) {
	user := AccountModel{}

	tableName := user.TableName()

	assert.Equal(t, "accounts", tableName)
}

func Test_CreateAccountModel(t *testing.T) {
	// success
	user, err := CreateAccountModel("name", "email", "password")
	assert.Nil(t, err)
	assert.NotNil(t, user)

	// failed: user name required
	user, err = CreateAccountModel("", "email", "password")
	assert.Equal(t, application_error.ERR_REQUIRED_ACCOUNT_NAME, err)
	assert.Nil(t, user)

	// failed: name cannot be more than 191 characters
	user, err = CreateAccountModel("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra enim imperdiet, consectetur felis in, pharetra nisi. Curabitur non ex pellentesque, imperdiet nisl at, finibus mauris. Curabitur eu tempus nisi.", "email", "password")
	assert.Equal(t, application_error.ERR_MAXIMUM_LENGTH_ACCOUNT_NAME, err)
	assert.Nil(t, user)

	// failed: email is required
	user, err = CreateAccountModel("name", "", "password")
	assert.Equal(t, application_error.ERR_REQUIRED_ACCOUNT_EMAIL, err)
	assert.Nil(t, user)

	// failed: minimum length for password is 8 characters
	user, err = CreateAccountModel("name", "email", "short")
	assert.Equal(t, application_error.ERR_MINIMUM_LENGTH_ACCOUNT_PASSWORD, err)
	assert.Nil(t, user)
}

func Test_AccountModel_SetName(t *testing.T) {
	var err error

	user := &AccountModel{
		Id: uuid.New().String(),
	}

	// success
	err = user.SetName("name")
	assert.Nil(t, err)

	// failed: user name required
	err = user.SetName("")
	assert.Equal(t, application_error.ERR_REQUIRED_ACCOUNT_NAME, err)

	// failed: name cannot be more than 191 characters
	err = user.SetName("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra enim imperdiet, consectetur felis in, pharetra nisi. Curabitur non ex pellentesque, imperdiet nisl at, finibus mauris. Curabitur eu tempus nisi.")
	assert.Equal(t, application_error.ERR_MAXIMUM_LENGTH_ACCOUNT_NAME, err)
}

func Test_AccountModel_SetEmail(t *testing.T) {
	var err error

	user := &AccountModel{
		Id: uuid.New().String(),
	}

	// success
	err = user.SetEmail("email")
	assert.Nil(t, err)

	// failed: email is required
	err = user.SetEmail("")
	assert.Equal(t, application_error.ERR_REQUIRED_ACCOUNT_EMAIL, err)
}

func Test_AccountModel_SetPassword(t *testing.T) {
	var err error

	user := &AccountModel{
		Id: uuid.New().String(),
	}

	// success
	err = user.SetPassword("password")
	assert.Nil(t, err)

	// failed: minimum length for password is 8 characters
	err = user.SetPassword("short")
	assert.Equal(t, application_error.ERR_MINIMUM_LENGTH_ACCOUNT_PASSWORD, err)
}

func Test_AccountModel_ComparePassword(t *testing.T) {
	var err error

	correctPassword := "ichikanito123"

	user := &AccountModel{
		Id:       uuid.New().String(),
		Password: "$2a$10$sR6zbg5dxmJKRaST4Jb4vOnxF1BmAsfICEkF6Lo5TmXxTjt6oAX7y", /* in plain text: ichikanito123 */
	}

	// success
	err = user.ComparePassword(correctPassword)
	assert.Nil(t, err)

	// failed: password is required
	err = user.ComparePassword("")
	assert.Equal(t, application_error.ERR_REQUIRED_ACCOUNT_PASSWORD, err)

	// failed: password is wrong
	err = user.ComparePassword("wrongpassword")
	assert.Equal(t, application_error.ERR_WRONG_ACCOUNT_PASSWORD, err)
}

func Test_AccountModel_GetPublicInfo(t *testing.T) {
	userId := uuid.New().String()

	user := &AccountModel{
		Id: userId,
	}

	assert.NotNil(t, user.GetPublicInfo())
}
