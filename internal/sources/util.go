package sources

import (
	"context"
	"math"
	"strconv"
	"strings"
	"sync"
)

func atoiDefault(value string, fallback int) int {
	parsed, err := strconv.Atoi(strings.TrimSpace(value))
	if err != nil {
		return fallback
	}

	return parsed
}

func roundFloatStringDefault(value string, fallback int) int {
	parsed, err := strconv.ParseFloat(strings.TrimSpace(value), 64)
	if err != nil {
		return fallback
	}

	return int(math.Round(parsed))
}

func roundOptionalFloatStringDefault(value *string, fallback int) int {
	if value == nil {
		return fallback
	}

	return roundFloatStringDefault(*value, fallback)
}

func roundFloat(value float64) int {
	return int(math.Round(value))
}

func capitalize(value string) string {
	if value == "" {
		return ""
	}

	return strings.ToUpper(value[:1]) + strings.ToLower(value[1:])
}

func mapConcurrent[T any, R any](ctx context.Context, values []T, concurrency int, fn func(context.Context, T) (R, error)) ([]R, error) {
	if concurrency <= 0 {
		concurrency = 1
	}

	parentCtx := ctx
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	results := make([]R, len(values))
	jobs := make(chan int)
	errs := make(chan error, 1)

	var wg sync.WaitGroup
	for range concurrency {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for idx := range jobs {
				result, err := fn(ctx, values[idx])
				if err != nil {
					select {
					case errs <- err:
						cancel()
					default:
					}
					continue
				}

				results[idx] = result
			}
		}()
	}

sendLoop:
	for idx := range values {
		select {
		case <-ctx.Done():
			break sendLoop
		case jobs <- idx:
		}
	}
	close(jobs)
	wg.Wait()

	select {
	case err := <-errs:
		return nil, err
	default:
	}

	if err := parentCtx.Err(); err != nil {
		return nil, err
	}

	return results, nil
}
