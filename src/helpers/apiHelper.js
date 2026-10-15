
const BASE_URL =
  import.meta.env?.VITE_DELCOM_BASEURL ||
  'https://open-api.delcom.org/api/v1';

export function getToken() {
  const storage = globalThis.localStorage;

  if (storage === undefined) {
    return '';
  }

  return storage.getItem('token') || '';
}

export function setToken(token) {
  const storage = globalThis.localStorage;

  if (storage === undefined) {
    return;
  }

  if (token) {
    storage.setItem('token', token);
    return;
  }

  storage.removeItem('token');
}

export function buildUrl(path, query = {}) {
  const origin = globalThis.window?.location?.origin;
  const url = new URL(
    `${BASE_URL}${path}`,
    origin || 'http://localhost'
  );

  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

export async function apiRequest(path, options = {}) {
  const {
    query,
    body,
    token = getToken(),
    headers = {},
    ...rest
  } = options;

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody = body;

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    method: rest.method || (body === undefined ? 'GET' : 'POST'),
    headers: requestHeaders,
    body: requestBody,
  });

  let payload;

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || payload.status !== 'success') {
    throw new Error(
      payload.message || `Permintaan gagal (${response.status})`
    );
  }

  return payload;
}

export const apiGet = (path, query) =>
  apiRequest(path, { query });

export const apiPost = (path, body) =>
  apiRequest(path, { method: 'POST', body });

export const apiPut = (path, body) =>
  apiRequest(path, { method: 'PUT', body });

export const apiDelete = (path) =>
  apiRequest(path, { method: 'DELETE' });
