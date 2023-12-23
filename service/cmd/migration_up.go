package cmd

import (
	"github.com/spf13/cobra"
)

var migrationUpCommand = &cobra.Command{
	Use:   "up",
	Short: "Run the migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		err := runMigration(cmd.Use, args)
		if err != nil {
			return err
		}

		return nil
	},
}

func init() {
	migrationCommand.AddCommand(migrationUpCommand)
}
