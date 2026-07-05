package scraper

import "github.com/undertideco/nebulo-scraper/internal/model"

// Location is a latitude/longitude pair.
type Location = model.Location

// City is the normalized air-quality record returned by scrapers.
type City = model.City

// Geocoder resolves addresses to coordinates and coordinates back to names.
type Geocoder = model.Geocoder
