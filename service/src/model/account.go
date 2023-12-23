package model

import (
	"time"

	"github.com/google/uuid"
	application_error "github.com/syauqeesy/social-media/src/application-error"
	"github.com/syauqeesy/social-media/src/payload"
	"golang.org/x/crypto/bcrypt"
)

type AccountModel struct {
	Id        string `gorm:"primaryKey;type:char(36);not null"`
	Name      string `gorm:"type:varchar(191);not null"`
	Username  string `gorm:"type:varchar(32);not null"`
	Password  string `gorm:"type:text;not null"`
	CreatedAt int64  `gorm:"autoCreateTime:milli;not null"`
	UpdatedAt *int64 `gorm:"autoUpdateTime:milli;default:null"`
	DeletedAt *int64 `gorm:"softDelete:milli;default:null"`
}

func (AccountModel) TableName() string {
	return "accounts"
}

func CreateAccountModel(name string, Username string, password string) (*AccountModel, error) {
	accountModel := &AccountModel{
		Id: uuid.New().String(),
	}

	if err := accountModel.SetName(name); err != nil {
		return nil, err
	}
	if err := accountModel.SetUsername(Username); err != nil {
		return nil, err
	}
	if err := accountModel.SetPassword(password); err != nil {
		return nil, err
	}

	return accountModel, nil
}

func (m *AccountModel) SetName(name string) error {
	if len(name) < 1 {
		return application_error.ERR_REQUIRED_ACCOUNT_NAME
	}
	if len(name) > 191 {
		return application_error.ERR_MAXIMUM_LENGTH_ACCOUNT_NAME
	}

	m.Name = name

	return nil
}

func (m *AccountModel) SetUsername(Username string) error {
	if len(Username) < 1 {
		return application_error.ERR_REQUIRED_ACCOUNT_USERNAME
	}

	m.Username = Username

	return nil
}

func (m *AccountModel) SetPassword(password string) error {
	if len(password) < 8 {
		return application_error.ERR_MINIMUM_LENGTH_ACCOUNT_PASSWORD
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	m.Password = string(hashedPassword)

	return nil
}

func (m *AccountModel) ComparePassword(password string) error {
	if len(password) < 1 {
		return application_error.ERR_REQUIRED_ACCOUNT_PASSWORD
	}

	if err := bcrypt.CompareHashAndPassword([]byte(m.Password), []byte(password)); err != nil {
		return application_error.ERR_WRONG_ACCOUNT_PASSWORD
	}

	return nil
}

func (m AccountModel) GetPublicInfo() *payload.AccountInfo {
	accountInfo := &payload.AccountInfo{
		Id:        m.Id,
		Name:      m.Name,
		Username:  m.Username,
		CreatedAt: time.Unix(0, m.CreatedAt*int64(time.Millisecond)),
	}

	return accountInfo
}
