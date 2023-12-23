package model

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/syauqeesy/social-media/src/payload"
)

func Test_FileGroupModel_TableName(t *testing.T) {
	fileGroup := FileGroupModel{}

	tableName := fileGroup.TableName()

	assert.Equal(t, "file_groups", tableName)
}

func Test_CreateFileGroupModel(t *testing.T) {
	fileGroup, err := CreateFileGroupModel()

	assert.Nil(t, err)
	assert.NotNil(t, fileGroup)
}

func Test_FileGroupModel_GetPublicInfo(t *testing.T) {
	fileGroupId := uuid.New().String()
	baseUrl := "base_url"

	fileGroup := &FileGroupModel{
		Id: fileGroupId,
		Files: []*FileModel{
			{
				Id:           "1",
				FileGroupId:  &fileGroupId,
				Name:         "File name 1",
				OriginalName: "Original file name 1",
				MimeType:     "image/png",
			},
			{
				Id:           "2",
				FileGroupId:  &fileGroupId,
				Name:         "File name 2",
				OriginalName: "Original file name 2",
				MimeType:     "image/png",
			},
		},
	}

	fileGroupInfo := make([]*payload.FileInfo, 0)

	for _, file := range fileGroup.Files {
		fileGroupInfo = append(fileGroupInfo, file.GetPublicInfo(baseUrl))
	}

	assert.Equal(t, fileGroupInfo, fileGroup.GetPublicInfo(baseUrl))
}
