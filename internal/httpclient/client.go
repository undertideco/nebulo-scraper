package httpclient

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"

type Client struct {
	httpClient *http.Client
}

func New(httpClient *http.Client) *Client {
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 30 * time.Second}
	}

	return &Client{httpClient: httpClient}
}

func (c *Client) Get(ctx context.Context, url string, accept string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", UserAgent)
	if accept != "" {
		req.Header.Set("Accept", accept)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("GET %s: %s: %s", url, resp.Status, string(body))
	}

	return body, nil
}

func GetJSON[T any](ctx context.Context, c *Client, url string, dst *T) error {
	body, err := c.Get(ctx, url, "application/json")
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, dst); err != nil {
		return fmt.Errorf("decode JSON from %s: %w", url, err)
	}

	return nil
}
