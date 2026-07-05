FROM golang:1.26-alpine AS build

WORKDIR /app
COPY go.mod .
COPY . .

RUN CGO_ENABLED=0 go build -o /nebulo-scraper ./cmd/nebulo-scraper

FROM alpine:3.24

WORKDIR /app
COPY --from=build /nebulo-scraper /usr/local/bin/nebulo-scraper

CMD ["nebulo-scraper"]
