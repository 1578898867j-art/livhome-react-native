const DEFAULT_TIMEOUT_MS = 15_000;

type FetchLike = typeof fetch;
type TokenProvider = () => Promise<string | null> | string | null;

export type ApiClientOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
  getToken?: TokenProvider;
  timeoutMs?: number;
};

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit;
  json?: unknown;
  token?: string | null;
  timeoutMs?: number;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorFromResponse(response: Response, body: unknown) {
  const message = isRecord(body) && typeof body.message === 'string'
    ? body.message
    : `Request failed with status ${response.status}`;
  const code = isRecord(body) && typeof body.code === 'string'
    ? body.code
    : `HTTP_${response.status}`;
  return new ApiError(message, response.status, code, body);
}

export function createApiClient({
  baseUrl = process.env.EXPO_PUBLIC_API_URL,
  fetchImpl = fetch,
  getToken,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: ApiClientOptions = {}) {
  const normalizedBaseUrl = baseUrl?.trim().replace(/\/+$/, '');

  async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    if (!normalizedBaseUrl) {
      throw new ApiError('EXPO_PUBLIC_API_URL is not configured', 0, 'API_NOT_CONFIGURED');
    }
    if (options.body !== undefined && options.json !== undefined) {
      throw new ApiError('Use either body or json, not both', 0, 'INVALID_REQUEST');
    }

    const controller = new AbortController();
    const externalSignal = options.signal;
    const abortFromExternalSignal = () => controller.abort();
    if (externalSignal?.aborted) controller.abort();
    externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true });

    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? timeoutMs);
    let rejectTokenWait: (() => void) | undefined;
    try {
      const headers = new Headers(options.headers);
      const token = await Promise.race([
        Promise.resolve(options.token === undefined ? getToken?.() : options.token),
        new Promise<never>((_, reject) => {
          rejectTokenWait = () => reject(new Error('Request aborted'));
          if (controller.signal.aborted) rejectTokenWait();
          else controller.signal.addEventListener('abort', rejectTokenWait, { once: true });
        }),
      ]);
      if (rejectTokenWait) controller.signal.removeEventListener('abort', rejectTokenWait);
      rejectTokenWait = undefined;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      if (options.json !== undefined) headers.set('Content-Type', 'application/json');

      const { body, json, timeoutMs: _timeoutMs, token: _token, signal: _signal, ...requestInit } = options;
      const response = await fetchImpl(`${normalizedBaseUrl}/${path.replace(/^\/+/, '')}`, {
        ...requestInit,
        body: json === undefined ? body : JSON.stringify(json),
        headers,
        signal: controller.signal,
      });
      const responseBody = await readBody(response);
      if (!response.ok) throw errorFromResponse(response, responseBody);
      return responseBody as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) {
        const cancelled = externalSignal?.aborted;
        throw new ApiError(
          cancelled ? 'Request cancelled' : 'Request timed out',
          0,
          cancelled ? 'ABORTED' : 'TIMEOUT',
        );
      }
      throw new ApiError('Network request failed', 0, 'NETWORK_ERROR', error);
    } finally {
      clearTimeout(timeout);
      if (rejectTokenWait) controller.signal.removeEventListener('abort', rejectTokenWait);
      externalSignal?.removeEventListener('abort', abortFromExternalSignal);
    }
  }

  return { request };
}

export const apiClient = createApiClient();
