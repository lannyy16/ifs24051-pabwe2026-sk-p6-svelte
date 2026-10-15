
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';

import {
  getToken,
  setToken,
  buildUrl,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from './apiHelper';

// ==========================================
// 1. BASE_URL
// ==========================================
describe('BASE_URL - Environment Variable', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('menggunakan URL custom dari environment', async () => {
    vi.stubEnv('VITE_DELCOM_BASEURL', 'https://api.custom.com/v2');
    vi.resetModules();

    const { buildUrl: buildCustomUrl } = await import('./apiHelper');

    expect(buildCustomUrl('/users')).toContain(
      'https://api.custom.com/v2/users',
    );
  });

  it('menggunakan URL default jika environment kosong', async () => {
    vi.stubEnv('VITE_DELCOM_BASEURL', '');
    vi.resetModules();

    const { buildUrl: buildDefaultUrl } = await import('./apiHelper');

    expect(buildDefaultUrl('/users')).toContain(
      'https://open-api.delcom.org/api/v1/users',
    );
  });
});

// ==========================================
// 2. buildUrl
// ==========================================
describe('buildUrl', () => {
  it('membuat URL dengan path', () => {
    expect(buildUrl('/users')).toContain('/users');
  });

  it('menambahkan query parameter', () => {
    const url = new URL(
      buildUrl('/users', {
        page: 1,
        search: 'karina',
      }),
    );

    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('search')).toBe('karina');
  });

  it('mengabaikan query kosong, null, dan undefined', () => {
    const url = new URL(
      buildUrl('/users', {
        empty: '',
        nil: null,
        missing: undefined,
        page: 1,
      }),
    );

    expect(url.searchParams.has('empty')).toBe(false);
    expect(url.searchParams.has('nil')).toBe(false);
    expect(url.searchParams.has('missing')).toBe(false);
    expect(url.searchParams.get('page')).toBe('1');
  });

  it('menangani query null', () => {
    expect(buildUrl('/users', null)).toContain('/users');
  });

  it('mengubah nilai query menjadi string', () => {
    const url = new URL(
      buildUrl('/users', {
        active: false,
        count: 0,
      }),
    );

    expect(url.searchParams.get('active')).toBe('false');
    expect(url.searchParams.get('count')).toBe('0');
  });

  it('menggunakan fallback saat window tidak tersedia', () => {
    const originalWindow = Object.getOwnPropertyDescriptor(
      globalThis,
      'window',
    );

    try {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: undefined,
      });

      const url = buildUrl('/users');

      // BASE_URL adalah URL absolut, sehingga URL API tetap digunakan.
      expect(url).toContain(
        'https://open-api.delcom.org/api/v1/users',
      );
    } finally {
      if (originalWindow) {
        Object.defineProperty(
          globalThis,
          'window',
          originalWindow,
        );
      }
    }
  });
});

// ==========================================
// 3. TOKEN MANAGEMENT
// ==========================================
describe('Token Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mengambil token yang tersimpan', () => {
    localStorage.setItem('token', 'abc-123');

    expect(getToken()).toBe('abc-123');
  });

  it('mengembalikan string kosong jika token tidak tersedia', () => {
    expect(getToken()).toBe('');
  });

  it('mengembalikan string kosong jika localStorage tidak tersedia', () => {
    const originalStorage = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage',
    );

    try {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: undefined,
      });

      expect(getToken()).toBe('');
    } finally {
      if (originalStorage) {
        Object.defineProperty(
          globalThis,
          'localStorage',
          originalStorage,
        );
      }
    }
  });

  it('menyimpan token', () => {
    setToken('new-token');

    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('menghapus token jika nilainya kosong', () => {
    localStorage.setItem('token', 'old-token');

    setToken('');

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('tidak error jika localStorage tidak tersedia saat menyimpan', () => {
    const originalStorage = Object.getOwnPropertyDescriptor(
      globalThis,
      'localStorage',
    );

    try {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: undefined,
      });

      expect(() => setToken('test-token')).not.toThrow();
    } finally {
      if (originalStorage) {
        Object.defineProperty(
          globalThis,
          'localStorage',
          originalStorage,
        );
      }
    }
  });
});

// ==========================================
// 4. apiRequest
// ==========================================
describe('apiRequest', () => {
  beforeEach(() => {
    localStorage.clear();

    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('melakukan GET request dengan sukses', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'success',
        data: { id: 1 },
      }),
    });

    await expect(apiRequest('/test')).resolves.toEqual({
      status: 'success',
      data: { id: 1 },
    });
  });

  it('menambahkan Authorization jika token tersedia', async () => {
    localStorage.setItem('token', 'secret-token');

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test');

    expect(
      global.fetch.mock.calls[0][1].headers.Authorization,
    ).toBe('Bearer secret-token');
  });

  it('tidak menambahkan Authorization jika token kosong', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test');

    expect(
      global.fetch.mock.calls[0][1].headers.Authorization,
    ).toBeUndefined();
  });

  it('mengirim body FormData tanpa Content-Type JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    const formData = new FormData();

    await apiRequest('/upload', {
      method: 'POST',
      body: formData,
    });

    const options = global.fetch.mock.calls[0][1];

    expect(options.body).toBe(formData);
    expect(options.headers['Content-Type']).toBeUndefined();
  });

  it('mengubah body biasa menjadi JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    const body = { name: 'Karina' };

    await apiRequest('/users', {
      method: 'POST',
      body,
    });

    const options = global.fetch.mock.calls[0][1];

    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe(JSON.stringify(body));
  });

  it('menangani response yang bukan JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(apiRequest('/test')).rejects.toThrow(
      'Permintaan gagal (200)',
    );
  });

  it('melempar pesan error dari API', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        status: 'error',
        message: 'Email sudah terdaftar',
      }),
    });

    await expect(apiRequest('/register')).rejects.toThrow(
      'Email sudah terdaftar',
    );
  });

  it('melempar pesan error default jika pesan API tidak tersedia', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(apiRequest('/test')).rejects.toThrow(
      'Permintaan gagal (500)',
    );
  });

  it('melempar error jika status payload bukan success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'error',
        message: 'Data tidak valid',
      }),
    });

    await expect(apiRequest('/test')).rejects.toThrow(
      'Data tidak valid',
    );
  });

  it('menggunakan GET jika body tidak tersedia', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test');

    expect(global.fetch.mock.calls[0][1].method).toBe('GET');
  });

  it('menggunakan POST jika body tersedia tanpa method khusus', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test', {
      body: { name: 'Karina' },
    });

    expect(global.fetch.mock.calls[0][1].method).toBe('POST');
  });

  it('memprioritaskan method yang ditentukan pengguna', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test', {
      method: 'PATCH',
    });

    expect(global.fetch.mock.calls[0][1].method).toBe('PATCH');
  });

  it('mempertahankan header tambahan', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test', {
      headers: {
        'X-Test': 'test-value',
      },
    });

    expect(
      global.fetch.mock.calls[0][1].headers['X-Test'],
    ).toBe('test-value');
  });

  it('menggunakan token eksplisit yang diberikan', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });

    await apiRequest('/test', {
      token: 'explicit-token',
    });

    expect(
      global.fetch.mock.calls[0][1].headers.Authorization,
    ).toBe('Bearer explicit-token');
  });
});

// ==========================================
// 5. API SHORTHAND METHODS
// ==========================================
describe('API Shorthand Methods', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('apiGet menggunakan GET', async () => {
    await apiGet('/test', { page: 1 });

    expect(global.fetch.mock.calls[0][1].method).toBe('GET');
    expect(global.fetch.mock.calls[0][0]).toContain('page=1');
  });

  it('apiPost menggunakan POST', async () => {
    await apiPost('/test', { name: 'Karina' });

    expect(global.fetch.mock.calls[0][1].method).toBe('POST');
    expect(global.fetch.mock.calls[0][1].body).toBe(
      JSON.stringify({ name: 'Karina' }),
    );
  });

  it('apiPut menggunakan PUT', async () => {
    await apiPut('/test', { name: 'Karina' });

    expect(global.fetch.mock.calls[0][1].method).toBe('PUT');
  });

  it('apiDelete menggunakan DELETE', async () => {
    await apiDelete('/test');

    expect(global.fetch.mock.calls[0][1].method).toBe('DELETE');
  });
});
