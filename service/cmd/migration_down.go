package cmd

import (
	"github.com/spf13/cobra"
)

var migrationDownCommand = &cobra.Command{
	Use:   "down",
	Short: "Rollback the migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		err := runMigration(cmd.Use, args)
		if err != nil {
			return err
		}

		return nil
	},
}

func init() {
	migrationCommand.AddCommand(migrationDownCommand)
}
