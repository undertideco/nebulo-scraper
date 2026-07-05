# Agent Instructions

This repository uses an agent harness pattern inspired by OpenAI's Harness Engineering guidance: keep startup context small, put durable repo knowledge in versioned docs, and make verification commands explicit.

Start here:

- Read `docs/AGENT_HARNESS.md` before making non-trivial changes.
- Public package surface lives at the repository root as `package scraper`.
- Region-specific scraper implementations live under `internal/sources` and should stay hidden from external consumers.
- Run `gofmt` on edited Go files.
- Run `GOCACHE=/private/tmp/nebulo-go-cache go test ./...` before handing off changes.

Git requirements:

- Commit messages must follow Conventional Commits, for example `feat: add geocode cache interface`.
- Agent-authored commits must include a `Co-Authored-By:` trailer.
- Do not commit generated output files from `output/`.
