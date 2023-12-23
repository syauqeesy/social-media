package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/syauqeesy/social-media/src/application"
)

var root = &cobra.Command{
	Use:     "boot",
	Short:   "Start the CRUD Application Server",
	Version: "v1.0.0",
	RunE: func(cmd *cobra.Command, args []string) error {
		err := application.Run(application.APPLICATION_HTTP, application.WithArguments(args))
		if err != nil {
			return err
		}

		return nil
	},
}

func Execute() {
	if err := root.Execute(); err != nil {
		log.Fatalf("Error executing the root cmd: %v.", err)
		panic(err)
	}
}
