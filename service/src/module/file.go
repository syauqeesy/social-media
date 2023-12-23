package module

import (
	"encoding/base64"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"strings"

	"github.com/google/uuid"
	application_error "github.com/syauqeesy/social-media/src/application-error"
	"github.com/syauqeesy/social-media/src/model"
	"github.com/syauqeesy/social-media/src/payload"
)

type FileModule interface {
	Create(request *payload.FileRequest, fileGroupId *string, fileType model.FileType) (*model.FileModel, error)
}

type fileModule module

func (m *fileModule) Create(request *payload.FileRequest, fileGroupId *string, fileType model.FileType) (*model.FileModel, error) {
	fileFormat, mimeType, err := m.filterFile(request.File, fileType)
	if err != nil {
		return nil, err
	}

	filename := uuid.New().String() + "." + fileFormat

	containerFile, err := os.Create("./storage/" + filename)
	if err != nil {
		return nil, err
	}

	defer containerFile.Close()

	fileInBytes, err := base64.StdEncoding.DecodeString(request.File)
	if err != nil {
		return nil, err
	}

	_, err = containerFile.Write(fileInBytes)
	if err != nil {
		return nil, err
	}

	fileModel, err := model.CreateFileModel(filename, request.OriginalName+"."+fileFormat, mimeType)
	if err != nil {
		return nil, err
	}

	if fileGroupId != nil {
		if err := fileModel.SetFileGroupId(*fileGroupId); err != nil {
			return nil, err
		}
	}

	return fileModel, nil
}

func (m *fileModule) filterFile(file string, fileType model.FileType) (string, model.MimeType, error) {
	var (
		fileFormat string
		mimeType   model.MimeType
		err        error
	)

	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(file))

	switch fileType {
	default:
		_, fileFormat, err = image.Decode(reader)
		if err != nil {
			return "", "", application_error.ERR_FILE_IMAGE_TYPE
		}
	}

	switch fileFormat {
	case "png":
		mimeType = model.MIME_TYPE_PNG
	default:
		mimeType = model.MIME_TYPE_JPEG
	}

	return fileFormat, mimeType, nil
}
