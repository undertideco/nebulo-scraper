package model

import "context"

// Location is a latitude/longitude pair.
type Location struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// City is the normalized air-quality record returned by scrapers.
type City struct {
	Name     string   `json:"name"`
	Region   string   `json:"region"`
	Location Location `json:"location"`
	Data     int      `json:"data"`
}

// Geocoder resolves addresses to coordinates and coordinates back to names.
type Geocoder interface {
	LatLng(ctx context.Context, address string) (Location, error)
	Address(ctx context.Context, lat float64, lng float64) (string, error)
}
