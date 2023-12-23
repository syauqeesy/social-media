package application

import "github.com/syauqeesy/social-media/config"

type Application interface {
	Run() error
}

const (
	APPLICATION_MIGRATION = "migration"
	APPLICATION_HTTP      = "http"
)

func Run(applicationType string, options ...OptionFunction) error {
	application, err := New(applicationType, options...)
	if err != nil {
		return err
	}

	err = application.Run()
	if err != nil {
		return err
	}

	return nil
}

func New(applicationType string, options ...OptionFunction) (Application, error) {
	o := new(Option)
	for _, option := range options {
		option(o)
	}
	o.Default()

	config, err := config.Load("./")
	if err != nil {
		return nil, err
	}

	switch applicationType {
	case APPLICATION_HTTP:
		return &httpApplication{
			Arguments:  o.Arguments,
			Config:     config,
			SubCommand: o.SubCommand,
		}, nil
	case APPLICATION_MIGRATION:
		return &migrationApplication{
			Arguments:  o.Arguments,
			Config:     config,
			SubCommand: o.SubCommand,
		}, nil
	default:
		return &httpApplication{
			Arguments:  o.Arguments,
			Config:     config,
			SubCommand: o.SubCommand,
		}, nil
	}
}
