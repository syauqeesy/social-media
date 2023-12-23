package application

import (
	"os"
	"os/signal"
	"syscall"
)

type gracefullShutdown struct {
	channel chan os.Signal
}

func NewGracefullShutdown() *gracefullShutdown {
	chanServer := make(chan os.Signal, 1)
	signal.Notify(chanServer, syscall.SIGTERM, syscall.SIGINT, os.Interrupt)

	return &gracefullShutdown{
		channel: chanServer,
	}
}

func (sc *gracefullShutdown) Wait() {
	defer close(sc.channel)

	<-sc.channel
	signal.Stop(sc.channel)
}
