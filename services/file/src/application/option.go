package application

type Option struct {
	Arguments  []string
	SubCommand string
}

func (o *Option) Default() *Option { return o }

type OptionFunction func(o *Option)

func WithArguments(Arguments []string) OptionFunction {
	return func(o *Option) {
		o.Arguments = Arguments
	}
}

func WithSubCommand(SubCommand string) OptionFunction {
	return func(o *Option) {
		o.SubCommand = SubCommand
	}
}
