package model

import (
	"github.com/google/uuid"
	"github.com/syauqeesy/social-media/src/payload"
)

type FileGroupModel struct {
	Id        string       `gorm:"primaryKey;type:char(36);not null"`
	Files     []*FileModel `gorm:"foreignKey:FileGroupId"`
	CreatedAt int64        `gorm:"autoCreateTime:milli;not null"`
	UpdatedAt *int64       `gorm:"autoUpdateTime:milli;default:null"`
	DeletedAt *int64       `gorm:"softDelete:milli;default:null"`
}

func (FileGroupModel) TableName() string {
	return "file_groups"
}

func CreateFileGroupModel() (*FileGroupModel, error) {
	fileGroup := &FileGroupModel{
		Id: uuid.New().String(),
	}

	return fileGroup, nil
}

func (m FileGroupModel) GetPublicInfo(baseUrl string) []*payload.FileInfo {
	fileInfos := make([]*payload.FileInfo, 0)

	for _, file := range m.Files {
		fileInfos = append(fileInfos, file.GetPublicInfo(baseUrl))
	}

	return fileInfos
}
