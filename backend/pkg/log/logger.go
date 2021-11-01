package log

import (
	"github.com/sirupsen/logrus"
)

type Logger interface {
	Debugf(format string, args ...interface{})
	Infof(format string, args ...interface{})
	Warnf(format string, args ...interface{})
	Errorf(format string, args ...interface{})
}

func InitDefaultLogger(logLevel string) (Logger, error) {
	parsedLevel, err := logrus.ParseLevel(logLevel)
	if err != nil {
		return nil, err
	}
	logger := logrus.New()
	logger.SetLevel(parsedLevel)
	logger.SetFormatter(&logrus.TextFormatter{})
	logger.SetReportCaller(true)
	return logger, nil
}
