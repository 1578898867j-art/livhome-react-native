import assert from 'node:assert/strict';
import { ApiError, createApiClient } from '../src/api/client.ts';

const calls = [];
const client = createApiClient({
  baseUrl: 'https://api.example.test/',
  getToken: () => 'test-token',
  fetchImpl: async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({ id: 'device-1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
});

const result = await client.request('/v1/devices', { method: 'POST', json: { name: 'Living Room' } });
assert.deepEqual(result, { id: 'device-1' });
assert.equal(calls[0].url, 'https://api.example.test/v1/devices');
assert.equal(calls[0].init.headers.get('Authorization'), 'Bearer test-token');
assert.equal(calls[0].init.body, JSON.stringify({ name: 'Living Room' }));

const failingClient = createApiClient({
  baseUrl: 'https://api.example.test',
  fetchImpl: async () => new Response(JSON.stringify({ code: 'DEVICE_OFFLINE', message: 'Device offline' }), {
    status: 409,
    headers: { 'Content-Type': 'application/json' },
  }),
});

await assert.rejects(
  failingClient.request('/v1/devices/device-1/commands'),
  (error) => error instanceof ApiError && error.status === 409 && error.code === 'DEVICE_OFFLINE',
);

const timeoutClient = createApiClient({
  baseUrl: 'https://api.example.test',
  timeoutMs: 5,
  fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }),
});

await assert.rejects(
  timeoutClient.request('/v1/slow'),
  (error) => error instanceof ApiError && error.code === 'TIMEOUT',
);

const stalledTokenClient = createApiClient({
  baseUrl: 'https://api.example.test',
  timeoutMs: 5,
  getToken: () => new Promise(() => {}),
});

await assert.rejects(
  Promise.race([
    stalledTokenClient.request('/v1/token-stall'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Token timeout check stalled')), 100)),
  ]),
  (error) => error instanceof ApiError && error.code === 'TIMEOUT',
);

console.log('API client check passed');
