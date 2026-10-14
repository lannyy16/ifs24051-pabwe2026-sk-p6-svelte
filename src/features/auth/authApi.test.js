
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../helpers/apiHelper.js', () => ({
  apiPost: vi.fn(),
}));

import { apiPost } from '../../helpers/apiHelper.js';
import { loginApi, registerApi } from './authApi.js';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mengirim data login ke API', () => {
    loginApi('karina@example.com', 'password123');

    expect(apiPost).toHaveBeenCalledWith('/auth/login', {
      email: 'karina@example.com',
      password: 'password123',
    });
  });

  it('mengirim data registrasi ke API', () => {
    registerApi('Karina', 'karina@example.com', 'password123');

    expect(apiPost).toHaveBeenCalledWith('/auth/register', {
      name: 'Karina',
      email: 'karina@example.com',
      password: 'password123',
    });
  });

  it('mengembalikan hasil dari API login', () => {
    const response = { status: 'success', data: { token: 'abc' } };
    apiPost.mockReturnValueOnce(response);

    expect(loginApi('karina@example.com', 'secret')).toBe(response);
  });

  it('mengembalikan hasil dari API registrasi', () => {
    const response = { status: 'success' };
    apiPost.mockReturnValueOnce(response);

    expect(
      registerApi('Karina', 'karina@example.com', 'secret'),
    ).toBe(response);
  });
});
