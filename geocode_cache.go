package scraper

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"
)

// GeocodeCache stores Google geocoding results.
//
// Consumers can implement this interface with Redis, SQLite, object storage, or
// any other backing store without adding those dependencies to this module.
type GeocodeCache interface {
	// GetLocation returns a cached address-to-location result.
	GetLocation(ctx context.Context, address string) (Location, bool, error)
	// SetLocation stores an address-to-location result.
	SetLocation(ctx context.Context, address string, location Location) error
	// GetAddress returns a cached coordinate-to-address result.
	GetAddress(ctx context.Context, lat float64, lng float64) (string, bool, error)
	// SetAddress stores a coordinate-to-address result.
	SetAddress(ctx context.Context, lat float64, lng float64, address string) error
}

// MemoryGeocodeCache is a process-local GeocodeCache implementation.
type MemoryGeocodeCache struct {
	mu        sync.Mutex
	locations map[string]Location
	addresses map[string]string
}

// NewMemoryGeocodeCache returns an empty in-memory geocode cache.
func NewMemoryGeocodeCache() *MemoryGeocodeCache {
	return &MemoryGeocodeCache{
		locations: make(map[string]Location),
		addresses: make(map[string]string),
	}
}

// GetLocation returns a cached address-to-location result.
func (c *MemoryGeocodeCache) GetLocation(ctx context.Context, address string) (Location, bool, error) {
	if err := ctx.Err(); err != nil {
		return Location{}, false, err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	location, ok := c.locations[address]
	return location, ok, nil
}

// SetLocation stores an address-to-location result.
func (c *MemoryGeocodeCache) SetLocation(ctx context.Context, address string, location Location) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	c.locations[address] = location
	return nil
}

// GetAddress returns a cached coordinate-to-address result.
func (c *MemoryGeocodeCache) GetAddress(ctx context.Context, lat float64, lng float64) (string, bool, error) {
	if err := ctx.Err(); err != nil {
		return "", false, err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	address, ok := c.addresses[geocodeLocationKey(lat, lng)]
	return address, ok, nil
}

// SetAddress stores a coordinate-to-address result.
func (c *MemoryGeocodeCache) SetAddress(ctx context.Context, lat float64, lng float64, address string) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	c.addresses[geocodeLocationKey(lat, lng)] = address
	return nil
}

// JSONFileGeocodeCache persists geocoding results to a local JSON file.
type JSONFileGeocodeCache struct {
	path string
	mu   sync.Mutex
	data geocodeCacheData
}

// NewJSONFileGeocodeCache opens or creates a JSON file-backed geocode cache.
func NewJSONFileGeocodeCache(path string) (*JSONFileGeocodeCache, error) {
	if path == "" {
		return nil, errors.New("JSON geocode cache path is required")
	}

	cache := &JSONFileGeocodeCache{
		path: path,
		data: geocodeCacheData{
			Locations: make(map[string]Location),
			Addresses: make(map[string]string),
		},
	}
	if err := cache.load(); err != nil {
		return nil, err
	}

	return cache, nil
}

// GetLocation returns a cached address-to-location result.
func (c *JSONFileGeocodeCache) GetLocation(ctx context.Context, address string) (Location, bool, error) {
	if err := ctx.Err(); err != nil {
		return Location{}, false, err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	location, ok := c.data.Locations[address]
	return location, ok, nil
}

// SetLocation stores an address-to-location result and persists the file.
func (c *JSONFileGeocodeCache) SetLocation(ctx context.Context, address string, location Location) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	c.data.Locations[address] = location
	return c.save()
}

// GetAddress returns a cached coordinate-to-address result.
func (c *JSONFileGeocodeCache) GetAddress(ctx context.Context, lat float64, lng float64) (string, bool, error) {
	if err := ctx.Err(); err != nil {
		return "", false, err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	address, ok := c.data.Addresses[geocodeLocationKey(lat, lng)]
	return address, ok, nil
}

// SetAddress stores a coordinate-to-address result and persists the file.
func (c *JSONFileGeocodeCache) SetAddress(ctx context.Context, lat float64, lng float64, address string) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	c.mu.Lock()
	defer c.mu.Unlock()

	c.data.Addresses[geocodeLocationKey(lat, lng)] = address
	return c.save()
}

func (c *JSONFileGeocodeCache) load() error {
	body, err := os.ReadFile(c.path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}

		return err
	}
	if len(body) == 0 {
		return nil
	}

	if err := json.Unmarshal(body, &c.data); err != nil {
		return err
	}
	if c.data.Locations == nil {
		c.data.Locations = make(map[string]Location)
	}
	if c.data.Addresses == nil {
		c.data.Addresses = make(map[string]string)
	}

	return nil
}

func (c *JSONFileGeocodeCache) save() error {
	if err := os.MkdirAll(filepath.Dir(c.path), 0755); err != nil {
		return err
	}

	body, err := json.MarshalIndent(c.data, "", "  ")
	if err != nil {
		return err
	}

	tmpPath := c.path + ".tmp"
	if err := os.WriteFile(tmpPath, body, 0644); err != nil {
		return err
	}

	return os.Rename(tmpPath, c.path)
}

type geocodeCacheData struct {
	Locations map[string]Location `json:"locations"`
	Addresses map[string]string   `json:"addresses"`
}
