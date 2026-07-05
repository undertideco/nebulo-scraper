package scraper

import (
	"context"

	"github.com/sethvargo/go-envconfig"
)

// Configuration contains environment-backed settings needed by the default
// scraper integrations.
type Configuration struct {
	GoogleGeocodingAPIKey string `env:"GOOGLE_GEOCODING_API_KEY"`
	AirNowAPIKey          string `env:"AIRNOW_KEY"`
	MOENVAPIKey           string `env:"MOENV_API_KEY"`
}

// LoadConfiguration loads Configuration from the process environment using
// github.com/sethvargo/go-envconfig.
func LoadConfiguration(ctx context.Context) (Configuration, error) {
	var config Configuration
	if err := envconfig.Process(ctx, &config); err != nil {
		return Configuration{}, err
	}

	return config, nil
}
