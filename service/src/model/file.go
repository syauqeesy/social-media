package model

import (
	"fmt"

	"github.com/google/uuid"
	application_error "github.com/syauqeesy/social-media/src/application-error"
	"github.com/syauqeesy/social-media/src/payload"
)

type MimeType string

const (
	MIME_TYPE_JPEG MimeType = "image/jpeg"
	MIME_TYPE_PNG  MimeType = "image/png"
)

type FileType string

const (
	FILE_TYPE_IMAGE FileType = "image"
)

type FileModel struct {
	Id           string   `gorm:"primaryKey;type:char(36);not null"`
	FileGroupId  *string  `gorm:"type:char(36);null"`
	Name         string   `gorm:"type:char(36);not null"`
	OriginalName string   `gorm:"type:varchar(191);not null"`
	MimeType     MimeType `gorm:"type:varchar(32);not null"`
	CreatedAt    int64    `gorm:"autoCreateTime:milli;not null"`
	UpdatedAt    *int64   `gorm:"autoUpdateTime:milli;default:null"`
	DeletedAt    *int64   `gorm:"softDelete:milli;default:null"`
}

func (FileModel) TableName() string {
	return "files"
}

func CreateFileModel(
	name string,
	originalName string,
	mimeType MimeType,
) (*FileModel, error) {
	file := &FileModel{
		Id: uuid.New().String(),
	}

	if err := file.SetName(name); err != nil {
		return nil, err
	}
	if err := file.SetOriginalName(originalName); err != nil {
		return nil, err
	}
	if err := file.SetMimeType(mimeType); err != nil {
		return nil, err
	}

	return file, nil
}

func (m *FileModel) SetFileGroupId(fileGroupId string) error {
	if _, err := uuid.Parse(fileGroupId); err != nil {
		return err
	}

	m.FileGroupId = &fileGroupId

	return nil
}

func (m *FileModel) SetName(name string) error {
	m.Name = name

	return nil
}

func (m *FileModel) SetOriginalName(originalName string) error {
	if len(originalName) < 1 {
		return application_error.ERR_REQUIRED_FILE_ORIGINAL_NAME
	}
	if len(originalName) > 191 {
		return application_error.ERR_MAXIMUM_LENGTH_FILE_ORIGINAL_NAME
	}

	m.OriginalName = originalName

	return nil
}

func (m *FileModel) SetMimeType(mimeType MimeType) error {
	m.MimeType = mimeType

	return nil
}

func (m FileModel) GetPublicInfo(baseUrl string) *payload.FileInfo {
	return &payload.FileInfo{
		OriginalName: m.OriginalName,
		MimeType:     string(m.MimeType),
		Url:          fmt.Sprintf("%s/asset/%s", baseUrl, m.Name),
	}
}
