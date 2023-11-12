package config

import "github.com/spf13/viper"

type Config struct {
	Application ApplicationConfig `mapstructure:"application"`
	Database    DatabaseConfig    `mapstructure:"database"`
}

type ApplicationConfig struct {
	Address string `mapstructure:"address"`
	BaseUrl string `mapstructure:"base_url"`
	Secret  string `mapstructure:"secret"`
}

type DatabaseConfig struct {
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	Database string `mapstructure:"database"`
}

func Load(paths ...string) (*Config, error) {
	config := &Config{}

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")

	for _, path := range paths {
		viper.AddConfigPath(path)
	}

	err := viper.ReadInConfig()
	if err != nil {
		return nil, err
	}

	err = viper.Unmarshal(&config)
	if err != nil {
		return nil, err
	}

	return config, nil
}
