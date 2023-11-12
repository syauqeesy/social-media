package application

import (
	"fmt"
	"time"

	"github.com/syauqeesy/social-media/user/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitializeDB(config *config.Config) (*gorm.DB, error) {
	databaseDsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		config.Database.User,
		config.Database.Password,
		config.Database.Host,
		config.Database.Port,
		config.Database.Database,
	)

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	databaseConnection, err := gorm.Open(mysql.Open(databaseDsn), gormConfig)
	if err != nil {
		return nil, err
	}

	dbConfig, err := databaseConnection.DB()
	if err != nil {
		return nil, err
	}

	dbConfig.SetMaxIdleConns(2)
	dbConfig.SetMaxOpenConns(5)
	dbConfig.SetConnMaxIdleTime(time.Minute * 3)

	return databaseConnection, nil
}
