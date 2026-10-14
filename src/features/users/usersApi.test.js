
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../helpers/apiHelper.js', () => ({
  apiGet: vi.fn(),
  apiPut: vi.fn(),
  apiPost: vi.fn(),
}));

import { apiGet, apiPut, apiPost } from '../../helpers/apiHelper.js';
import {
  getUsers,
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  changePassword,
} from './usersApi.js';

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mengambil semua pengguna', () => {
    getUsers();
    expect(apiGet).toHaveBeenCalledWith('/users');
  });

  it('mengambil profil pengguna saat ini', () => {
    getMyProfile();
    expect(apiGet).toHaveBeenCalledWith('/users/me');
  });

  it('memperbarui profil pengguna', () => {
    const body = { name: 'Karina' };

    updateMyProfile(body);

    expect(apiPut).toHaveBeenCalledWith('/users/me', body);
  });

  it('mengunggah foto profil dalam FormData', () => {
    const file = new File(['photo'], 'profile.png', {
      type: 'image/png',
    });

    uploadProfilePhoto(file);

    expect(apiPost).toHaveBeenCalledWith(
      '/users/me/photo',
      expect.any(FormData),
    );

    const form = apiPost.mock.calls[0][1];
    expect(form.get('photo')).toBe(file);
  });

  it('mengubah kata sandi', () => {
    changePassword('old-password', 'new-password');

    expect(apiPut).toHaveBeenCalledWith('/users/me/password', {
      old_password: 'old-password',
      new_password: 'new-password',
    });
  });
});
