# Agent Harness

This document is the durable operating guide for coding agents working in this repository. It follows the main idea from OpenAI's Harness Engineering article: the repository should carry the context, constraints, and verification loop that agents need to work reliably.

Reference: https://openai.com/index/harness-engineering/

## Project Shape

`nebulo-scraper` is a Go module that exposes a reusable `scraper` package and a CLI.

The public API lives at the module root:

- `config.go`: environment-backed configuration.
- `scraper.go`: `Runner`, `Options`, and scrape orchestration.
- `types.go`: public aliases for normalized records and geocoding interfaces.
- `geocoder.go`: default Google geocoder.
- `geocode_cache.go`: cache interface plus memory and JSON-file implementations.

Private implementation details live under `internal/`:

- `internal/sources`: individual region scrapers.
- `internal/httpclient`: shared HTTP client helpers.
- `internal/envfile`: simple `.env` loader for the CLI.
- `internal/model`: shared data types used across root and internal packages.

The CLI entrypoint is `cmd/nebulo-scraper/main.go`.

## Public API Rules

Keep the root package small and consumer-oriented.

- Public structs, interfaces, and functions need doc comments.
- Prefer adding extension points as interfaces at the boundary where the dependency belongs.
- Do not expose individual region scraper packages publicly.
- Keep source names stable unless the output contract intentionally changes.
- The normalized output shape is `[]scraper.City`.

For geocoding cache behavior:

- Do not add Redis or another cache backend as a module dependency by default.
- Consumers can provide Redis by implementing `scraper.GeocodeCache`.
- The CLI should use a built-in cache implementation only.

## Commands

Format edited Go files:

```sh
gofmt -w <files>
```

Run tests:

```sh
GOCACHE=/private/tmp/nebulo-go-cache go test ./...
```

List sources without touching external APIs:

```sh
GOCACHE=/private/tmp/nebulo-go-cache go run ./cmd/nebulo-scraper -list-sources
```

Avoid full scrape smoke tests unless the user explicitly asks, because they hit live external APIs and require credentials.

## Change Workflow

1. Inspect the relevant existing files before editing.
2. Keep changes scoped to the requested behavior.
3. Preserve the public package import path: `github.com/undertideco/nebulo-scraper`.
4. Update README or harness docs when behavior, commands, or public API changes.
5. Run format and tests before final handoff.
6. Mention any external API paths that were not tested.

## Commit Policy

All commits must use Conventional Commits style:

```text
feat: add geocode cache interface
fix: handle empty Malaysia feature list
docs: document agent harness workflow
test: cover JSON geocode cache persistence
```

Agent-authored commits must include a `Co-Authored-By:` trailer:

```text
Co-Authored-By: OpenAI Codex <codex@openai.com>
```

If a different agent identity is required, use that identity consistently in the trailer.
