package mock_module

import (
	"github.com/stretchr/testify/mock"
	"github.com/syauqeesy/social-media/src/model"
	"github.com/syauqeesy/social-media/src/payload"
)

type FileModule struct {
	mock.Mock
}

func (_m *FileModule) Create(request *payload.FileRequest, fileGroupId *string, fileType model.FileType) (*model.FileModel, error) {
	args := _m.Called(request, fileGroupId, fileType)

	if args.Get(1) != nil {
		return nil, args.Get(1).(error)
	}

	return args.Get(0).(*model.FileModel), nil
}
