package sources

import (
	"encoding/json"
	"testing"
)

func TestMacauResponseIgnoresTopLevelMetadata(t *testing.T) {
	payload := []byte(`{
		"datetime": "2026-07-05 14:45",
		"enhopolu": {
			"DDTT": "2026070514",
			"HE_PM2_5": "9.000"
		}
	}`)

	var resp map[string]json.RawMessage
	if err := json.Unmarshal(payload, &resp); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}

	station, err := decodeMacauStation(resp["enhopolu"])
	if err != nil {
		t.Fatalf("decodeMacauStation() error = %v", err)
	}
	if got := roundOptionalFloatStringDefault(station.HEPM25, 0); got != 9 {
		t.Fatalf("enhopolu HE_PM2_5 = %d, want 9", got)
	}
}

func TestMalaysiaResponseAcceptsFloatAndNullAPI(t *testing.T) {
	payload := []byte(`{
		"features": [
			{"attributes": {"API": 46.0, "STATION_LOCATION": "A", "LONGITUDE": 100.1, "LATITUDE": 3.1}},
			{"attributes": {"API": null, "STATION_LOCATION": "B", "LONGITUDE": 100.2, "LATITUDE": 3.2}}
		]
	}`)

	var resp malaysiaResponse
	if err := json.Unmarshal(payload, &resp); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if len(resp.Features) != 2 {
		t.Fatalf("len(resp.Features) = %d, want 2", len(resp.Features))
	}
	if resp.Features[0].Attributes.API == nil || roundFloat(*resp.Features[0].Attributes.API) != 46 {
		t.Fatalf("first API = %#v, want 46.0", resp.Features[0].Attributes.API)
	}
	if resp.Features[1].Attributes.API != nil {
		t.Fatalf("second API = %#v, want nil", *resp.Features[1].Attributes.API)
	}
}
