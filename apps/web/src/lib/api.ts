const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined) {
        query.append(key, String(val));
      }
    }
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('silwasa_token') : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let formattedBody = customConfig.body;
  if (
    formattedBody &&
    typeof formattedBody === 'object' &&
    typeof FormData !== 'undefined' &&
    !(formattedBody instanceof FormData) &&
    typeof Blob !== 'undefined' &&
    !(formattedBody instanceof Blob)
  ) {
    formattedBody = JSON.stringify(formattedBody);
  }

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Automatically send and receive cookies
    ...customConfig,
    body: formattedBody,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred with your request',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Network connection failed';
    throw new ApiError(message, 500);
  }
}

apiClient.get = <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

apiClient.post = <T = unknown>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
  apiClient<T>(endpoint, { ...options, method: 'POST', body });

apiClient.put = <T = unknown>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> =>
  apiClient<T>(endpoint, { ...options, method: 'PUT', body });

apiClient.delete = <T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });

