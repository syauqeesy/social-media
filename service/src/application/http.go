package application

import (
	"context"
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/syauqeesy/social-media/config"
	"github.com/syauqeesy/social-media/src/handler"
	application_middleware "github.com/syauqeesy/social-media/src/middleware"
	"github.com/syauqeesy/social-media/src/module"
	"github.com/syauqeesy/social-media/src/repository"
	"github.com/syauqeesy/social-media/src/service"
)

type httpApplication struct {
	Arguments  []string
	Config     *config.Config
	SubCommand string
}

func (a *httpApplication) Run() error {
	echo := echo.New()
	gracefullShutdown := NewGracefullShutdown()

	database, err := InitializeDB(a.Config)
	if err != nil {
		return err
	}

	handler.NewHandler(
		echo,
		service.NewService(repository.NewRepository(database), module.NewModule(a.Config), a.Config),
		application_middleware.NewMiddleware(a.Config),
	)

	go func() {
		gracefullShutdown.Wait()

		if err := echo.Shutdown(context.Background()); err != nil {
			log.Printf("error in shutdown the server: %v.", err)
		}

	}()

	echo.Use(middleware.CORS())

	echo.Start(a.Config.Application.Address)

	return nil
}
