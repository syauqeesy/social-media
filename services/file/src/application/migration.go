package application

import (
	"fmt"
	"net/url"

	"github.com/amacneil/dbmate/pkg/dbmate"
	_ "github.com/amacneil/dbmate/pkg/driver/mysql"
	"github.com/syauqeesy/social-media/file/config"
)

type migrationApplication struct {
	Arguments  []string
	Config     *config.Config
	DBMate     *dbmate.DB
	SubCommand string
}

func (a *migrationApplication) Run() error {
	databaseDsn, err := url.Parse(fmt.Sprintf("mysql://%s:%s@%s:%s/%s",
		a.Config.Database.User,
		a.Config.Database.Password,
		a.Config.Database.Host,
		a.Config.Database.Port,
		a.Config.Database.Database))
	if err != nil {
		return err
	}

	db := dbmate.New(databaseDsn)

	db.MigrationsTableName = "social_media_file_migrations"
	db.MigrationsDir = "./migration"

	a.DBMate = db

	switch a.SubCommand {
	case "new":
		err = a.new(a.Arguments[0])
		if err != nil {
			return err
		}
	case "up":
		err = a.up()
		if err != nil {
			return err
		}
	case "down":
		err = a.down()
		if err != nil {
			return err
		}
	}

	return nil
}

func (a *migrationApplication) new(filename string) error {
	err := a.DBMate.NewMigration(filename)
	if err != nil {
		return err
	}

	return nil
}

func (a *migrationApplication) up() error {
	err := a.DBMate.CreateAndMigrate()
	if err != nil {
		return err
	}

	return nil
}

func (a *migrationApplication) down() error {
	err := a.DBMate.Rollback()
	if err != nil {
		return err
	}

	return nil
}
