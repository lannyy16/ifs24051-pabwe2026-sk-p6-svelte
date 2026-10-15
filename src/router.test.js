import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';

import { get } from 'svelte/store';
import {
  currentPath,
  navigate,
  resolveRoute,
} from './router.js';

describe('router.js', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('resolveRoute()', () => {
    it('mengembalikan halaman login', () => {
      expect(resolveRoute('/auth/login')).toEqual({
        layout: 'auth',
        page: 'login',
      });
    });

    it('mengembalikan halaman register', () => {
      expect(resolveRoute('/auth/register')).toEqual({
        layout: 'auth',
        page: 'register',
      });
    });

    it('mengembalikan halaman home', () => {
      expect(resolveRoute('/')).toEqual({
        layout: 'app',
        page: 'home',
      });
    });

    it('menangani slash di akhir path', () => {
      expect(resolveRoute('///')).toEqual({
        layout: 'app',
        page: 'home',
      });
    });

    it('mengembalikan halaman users', () => {
      expect(resolveRoute('/users')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('mengembalikan halaman profile', () => {
      expect(resolveRoute('/profile')).toEqual({
        layout: 'app',
        page: 'profile',
      });
    });

    it('mengabaikan query string', () => {
      expect(resolveRoute('/users?page=2')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('mengabaikan slash terakhir', () => {
      expect(resolveRoute('/users/')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('mengembalikan detail link tree', () => {
      expect(resolveRoute('/link-trees/123')).toEqual({
        layout: 'app',
        page: 'detail',
        linkTreeId: '123',
      });
    });

    it('mendekode ID link tree', () => {
      expect(resolveRoute('/link-trees/hello%20world')).toEqual({
        layout: 'app',
        page: 'detail',
        linkTreeId: 'hello world',
      });
    });

    it('mengembalikan not-found untuk route tidak dikenal', () => {
      expect(resolveRoute('/route-tidak-ada')).toEqual({
        layout: 'none',
        page: 'not-found',
      });
    });

    it.each(['', null, undefined])(
      'menggunakan halaman home untuk path %s',
      (path) => {
        expect(resolveRoute(path)).toEqual({
          layout: 'app',
          page: 'home',
        });
      },
    );

    it('mengembalikan not-found jika ID link tree kosong', () => {
      expect(resolveRoute('/link-trees/')).toEqual({
        layout: 'none',
        page: 'not-found',
      });
    });

    it('mengembalikan not-found untuk nested route', () => {
      expect(resolveRoute('/link-trees/123/items')).toEqual({
        layout: 'none',
        page: 'not-found',
      });
    });
  });

  describe('navigate()', () => {
    it('melakukan navigasi dengan pushState', () => {
      const spy = vi.spyOn(window.history, 'pushState');

      navigate('/users');

      expect(spy).toHaveBeenCalledWith({}, '', '/users');
      expect(window.location.pathname).toBe('/users');
      expect(get(currentPath)).toBe('/users');
    });

    it('melakukan navigasi dengan replaceState', () => {
      const spy = vi.spyOn(window.history, 'replaceState');

      navigate('/profile', { replace: true });

      expect(spy).toHaveBeenCalledWith({}, '', '/profile');
      expect(get(currentPath)).toBe('/profile');
    });

    it('menggunakan pushState jika replace false', () => {
      const spy = vi.spyOn(window.history, 'pushState');

      navigate('/users', { replace: false });

      expect(spy).toHaveBeenCalledWith({}, '', '/users');
    });

    it('mempertahankan query string', () => {
      navigate('/users?page=2');

      expect(get(currentPath)).toBe('/users?page=2');
      expect(window.location.search).toBe('?page=2');
    });

    it('memanggil scrollTo setelah navigasi', () => {
      navigate('/profile');

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('tetap bernavigasi ketika scrollTo tidak tersedia', () => {
      window.scrollTo = undefined;

      expect(() => navigate('/profile')).not.toThrow();
      expect(get(currentPath)).toBe('/profile');
    });

    it('menggunakan pushState jika options tidak diberikan', () => {
      const spy = vi.spyOn(window.history, 'pushState');

      navigate('/users');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('popstate event', () => {
    it('memperbarui currentPath ketika popstate terjadi', () => {
      window.history.pushState({}, '', '/users');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(get(currentPath)).toBe('/users');
    });

    it('memperbarui currentPath dengan query string', () => {
      window.history.pushState({}, '', '/profile?tab=settings');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(get(currentPath)).toBe('/profile?tab=settings');
    });
  });
});

describe('router.js dalam lingkungan Node', () => {
  it('menginisialisasi currentPath tanpa window', async () => {
    vi.resetModules();
    vi.stubGlobal('window', undefined);

    try {
      const { currentPath } = await import('./router.js');

      expect(get(currentPath)).toBe('/');
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });

  it('melakukan navigasi tanpa window', async () => {
    vi.resetModules();
    vi.stubGlobal('window', undefined);

    try {
      const { currentPath, navigate } = await import('./router.js');

      navigate('/server-route');

      expect(get(currentPath)).toBe('/server-route');
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });
});