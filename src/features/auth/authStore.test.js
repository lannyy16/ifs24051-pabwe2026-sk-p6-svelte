
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';

vi.mock('../../helpers/apiHelper.js', () => ({
  setToken: vi.fn(),
}));

import { setToken } from '../../helpers/apiHelper.js';
import {
  authUser,
  authLoading,
  saveSession,
  logout,
} from './authStore.js';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authUser.set(null);
    authLoading.set(false);
  });

  it('menyimpan token dan informasi pengguna', () => {
    const user = { id: 1, name: 'Karina' };

    saveSession('token-123', user);

    expect(setToken).toHaveBeenCalledWith('token-123');
    expect(get(authUser)).toEqual(user);
  });

  it('menyimpan sesi tanpa pengguna', () => {
    saveSession('token-456');

    expect(setToken).toHaveBeenCalledWith('token-456');
    expect(get(authUser)).toBeNull();
  });

  it('menghapus token dan pengguna saat logout', () => {
    saveSession('token-123', { id: 1 });

    logout();

    expect(setToken).toHaveBeenLastCalledWith('');
    expect(get(authUser)).toBeNull();
  });

  it('menyediakan status loading awal false', () => {
    expect(get(authLoading)).toBe(false);
  });
});
