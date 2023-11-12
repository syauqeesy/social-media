package cmd

import (
	"github.com/spf13/cobra"
)

var migrationNewCommand = &cobra.Command{
	Use:   "new",
	Short: "Create new migration",
	RunE: func(cmd *cobra.Command, args []string) error {
		err := runMigration(cmd.Use, args)
		if err != nil {
			return err
		}

		return nil
	},
}

func init() {
	migrationCommand.AddCommand(migrationNewCommand)
}
