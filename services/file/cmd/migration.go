package cmd

import (
	"github.com/spf13/cobra"
	"github.com/syauqeesy/social-media/file/src/application"
)

var migrationCommand = &cobra.Command{
	Use:   "migration",
	Short: "List migration commands",
}

func runMigration(subCommand string, args []string) error {
	err := application.Run(application.APPLICATION_MIGRATION, application.WithSubCommand(subCommand), application.WithArguments(args))
	if err != nil {
		return err
	}

	return nil
}

func init() {
	root.AddCommand(migrationCommand)
}
