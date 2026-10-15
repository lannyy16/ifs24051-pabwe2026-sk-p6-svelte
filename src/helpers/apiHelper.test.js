import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getToken,
  setToken,
  buildUrl,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
} from './apiHelper';

// ==========================================
// 1. TEST BASE_URL
// ==========================================
describe('BASE_URL - Environment Variable', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('harus menggunakan VITE_DELCOM_BASEURL jika diset', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_DELCOM_BASEURL', 'https://api.custom.com/v2');
    const { buildUrl } = await import('./apiHelper');
    const url = buildUrl('/users');
    expect(url).toContain('https://api.custom.com/v2/users');
  });

  it('harus menggunakan URL default jika VITE_DELCOM_BASEURL kosong', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_DELCOM_BASEURL', '');
    const { buildUrl } = await import('./apiHelper');
    const url = buildUrl('/users');
    expect(url).toContain('https://open-api.delcom.org/api/v1/users');
  });
});

// ==========================================
// 2. TEST buildUrl
// ==========================================
describe('buildUrl', () => {
  it('harus menambahkan query params dengan benar', () => {
    const url = buildUrl('/users', { page: 1, search: 'budi', empty: '', nil: null, undef: undefined });
    expect(url).toContain('page=1');
    expect(url).toContain('search=budi');
    expect(url).not.toContain('empty=');
    expect(url).not.toContain('nil=');
    expect(url).not.toContain('undef=');
  });

  it('harus menangani jika query tidak diberikan', () => {
    const url = buildUrl('/users');
    expect(url).toContain('/users');
  });

  it('harus menangani query null', () => {
    const url = buildUrl('/users', null);
    expect(url).toContain('/users');
  });
});

// ==========================================
// 3. TEST Token Management
// ==========================================
describe('Token Management', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
  });

  it('getToken harus mengembalikan token jika ada', () => {
    localStorage.setItem('token', 'abc-123');
    expect(getToken()).toBe('abc-123');
  });

  it('getToken harus mengembalikan string kosong jika token tidak ada', () => {
    expect(getToken()).toBe('');
  });

  it('getToken harus mengembalikan string kosong jika localStorage undefined', () => {
    const originalLocalStorage = global.localStorage;
    // @ts-ignore
    delete global.localStorage;
    // @ts-ignore
    delete globalThis.localStorage;

    expect(getToken()).toBe('');

    global.localStorage = originalLocalStorage;
    globalThis.localStorage = originalLocalStorage;
  });

  it('setToken harus menyimpan token', () => {
    setToken('new-token');
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('setToken harus menghapus token jika falsy', () => {
    localStorage.setItem('token', 'old-token');
    setToken('');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('setToken harus tidak error jika localStorage undefined', () => {
    const originalLocalStorage = global.localStorage;
    // @ts-ignore
    delete global.localStorage;
    // @ts-ignore
    delete globalThis.localStorage;

    expect(() => setToken('test')).not.toThrow();

    global.localStorage = originalLocalStorage;
    globalThis.localStorage = originalLocalStorage;
  });
});

// ==========================================
// 4. TEST apiRequest
// ==========================================
describe('apiRequest', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
    vi.restoreAllMocks();
  });

  it('harus melakukan GET request dengan sukses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', data: { id: 1 } })
    });
    const result = await apiRequest('/test');
    expect(result).toEqual({ status: 'success', data: { id: 1 } });
  });

  it('harus menambahkan Authorization header jika token ada', async () => {
    localStorage.setItem('token', 'secret-token');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    await apiRequest('/test');
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.headers.Authorization).toBe('Bearer secret-token');
  });

  it('harus TIDAK menambahkan Authorization header jika token kosong', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    await apiRequest('/test');
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.headers.Authorization).toBeUndefined();
  });

  it('harus menangani body FormData', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    const formData = new FormData();
    await apiRequest('/upload', { method: 'POST', body: formData });
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.headers['Content-Type']).toBeUndefined();
    expect(fetchArgs.body).toBe(formData);
  });

  it('harus menangani body JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    const jsonBody = { name: 'Budi' };
    await apiRequest('/users', { method: 'POST', body: jsonBody });
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.headers['Content-Type']).toBe('application/json');
    expect(fetchArgs.body).toBe(JSON.stringify(jsonBody));
  });

  it('harus menangani error jika response bukan JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => { throw new Error('Bukan JSON'); }
    });
    await expect(apiRequest('/test')).rejects.toThrow('Permintaan gagal (200)');
  });

  it('harus melempar error dengan pesan dari API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ status: 'error', message: 'Email sudah terdaftar' })
    });
    await expect(apiRequest('/register')).rejects.toThrow('Email sudah terdaftar');
  });

  it('harus melempar error dengan pesan default', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    });
    await expect(apiRequest('/test')).rejects.toThrow('Permintaan gagal (500)');
  });

  it('harus menggunakan GET jika body undefined', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    await apiRequest('/test');
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.method).toBe('GET');
  });

  it('harus menggunakan POST jika body ada', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    await apiRequest('/test', { body: { name: 'Budi' } });
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.method).toBe('POST');
  });

  it('harus menggunakan method yang ditentukan user', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
    await apiRequest('/test', { method: 'PATCH' });
    const fetchArgs = global.fetch.mock.calls[0][1];
    expect(fetchArgs.method).toBe('PATCH');
  });
});

// ==========================================
// 5. TEST Shorthand Methods
// ==========================================
describe('API Shorthand Methods', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });
  });

  it('apiGet harus memakai method GET', async () => {
    await apiGet('/test', { page: 1 });
    expect(global.fetch.mock.calls[0][1].method).toBe('GET');
  });

  it('apiPost harus memakai method POST', async () => {
    await apiPost('/test', { name: 'Budi' });
    expect(global.fetch.mock.calls[0][1].method).toBe('POST');
  });

  it('apiPut harus memakai method PUT', async () => {
    await apiPut('/test', { name: 'Budi' });
    expect(global.fetch.mock.calls[0][1].method).toBe('PUT');
  });

  it('apiDelete harus memakai method DELETE', async () => {
    await apiDelete('/test');
    expect(global.fetch.mock.calls[0][1].method).toBe('DELETE');
  });
});