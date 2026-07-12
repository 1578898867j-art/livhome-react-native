# LIVHOME API Contract

Status: draft for frontend/backend alignment. Endpoint names may change, but DTOs and unresolved decisions must be agreed before wiring screens to live data.

## Conventions

- Base URL: `EXPO_PUBLIC_API_URL`
- API prefix: `/v1`
- Content type: `application/json`, except uploads and streaming
- IDs: opaque strings
- Timestamps: UTC ISO 8601 strings
- Pagination: cursor-based using `cursor`, `limit`, and `nextCursor`
- Authentication: `Authorization: Bearer <accessToken>`
- Error body: `{ "code": "STABLE_CODE", "message": "Readable message", "details": {} }`
- Device mutations should accept an `Idempotency-Key` once retry behavior is enabled.

The TypeScript DTO source is `src/contracts/`. Backend responses should match those names and value domains or an explicit mapper must be added in the feature API module.

## Proposed Endpoints

| Feature | Method | Path | Purpose |
| --- | --- | --- | --- |
| Auth | POST | `/v1/auth/email/verification` | Send an email verification code |
| Auth | POST | `/v1/auth/session` | Exchange verification data for a session |
| Profile | GET | `/v1/me` | Load the current user profile |
| Devices | GET | `/v1/devices` | List devices for the home |
| Devices | GET | `/v1/devices/{deviceId}` | Load device state and capabilities |
| Devices | POST | `/v1/devices/{deviceId}/commands` | Execute a device command |
| Events | GET | `/v1/devices/{deviceId}/events` | List alerts with filters and pagination |
| Playback | GET | `/v1/devices/{deviceId}/playback` | Query available recording segments |
| Assistant | GET | `/v1/assistant/conversations` | List conversations |
| Assistant | POST | `/v1/assistant/conversations` | Create a conversation |
| Assistant | PATCH | `/v1/assistant/conversations/{conversationId}` | Rename a conversation |
| Assistant | DELETE | `/v1/assistant/conversations/{conversationId}` | Delete a conversation |
| Assistant | POST | `/v1/assistant/messages` | Send a user message |

## Required UI States

Every connected feature must define:

- initial loading and pull-to-refresh behavior
- empty state
- recoverable network error and retry action
- authorization failure behavior
- mutation progress and duplicate-submit prevention
- rollback or state refresh after a failed device command

## Open Decisions

- Assistant response transport: SSE, WebSocket, or chunked HTTP
- Access-token refresh endpoint and expiry rules
- Upload protocol for feedback images and avatars
- Device state push transport and reconnect behavior
- Playback URL lifetime and authorization mechanism
- Whether command idempotency is client-generated or server-issued

Resolve an item here before implementing the corresponding production flow.
