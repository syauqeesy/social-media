package model

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	application_error "github.com/syauqeesy/social-media/src/application-error"
)

func Test_FileModel_TableName(t *testing.T) {
	file := FileModel{}

	tableName := file.TableName()

	assert.Equal(t, "files", tableName)
}

func Test_CreateFileModel(t *testing.T) {
	// success
	file, err := CreateFileModel("name", "file original name", MIME_TYPE_JPEG)
	assert.Nil(t, err)
	assert.NotNil(t, file)

	// failed: file original name required
	file, err = CreateFileModel("name", "", MIME_TYPE_JPEG)
	assert.Equal(t, application_error.ERR_REQUIRED_FILE_ORIGINAL_NAME, err)
	assert.Nil(t, file)
}

func Test_FileModel_SetFileGroupId(t *testing.T) {
	var err error

	file := &FileModel{
		Id: uuid.New().String(),
	}

	// success
	err = file.SetFileGroupId(uuid.New().String())
	assert.Nil(t, err)

	// failed: id is not uuid
	err = file.SetFileGroupId("not uuid")
	assert.NotNil(t, err)
}

func Test_FileModel_SetName(t *testing.T) {
	var err error

	file := &FileModel{
		Id: uuid.New().String(),
	}

	// success
	err = file.SetName("file name")
	assert.Nil(t, err)
}

func Test_FileModel_SetOriginalName(t *testing.T) {
	var err error

	file := &FileModel{
		Id: uuid.New().String(),
	}

	// success
	err = file.SetOriginalName("file original name")
	assert.Nil(t, err)

	// failed: file original name required
	err = file.SetOriginalName("")
	assert.Equal(t, application_error.ERR_REQUIRED_FILE_ORIGINAL_NAME, err)

	// failed: file original name cannot be more than 191 characters
	err = file.SetOriginalName("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra enim imperdiet, consectetur felis in, pharetra nisi. Curabitur non ex pellentesque, imperdiet nisl at, finibus mauris. Curabitur eu tempus nisi.")
	assert.Equal(t, application_error.ERR_MAXIMUM_LENGTH_FILE_ORIGINAL_NAME, err)
}

func Test_FileModel_SetMimeType(t *testing.T) {
	var err error

	file := &FileModel{
		Id: uuid.New().String(),
	}

	err = file.SetMimeType(MIME_TYPE_JPEG)
	assert.Nil(t, err)
}
