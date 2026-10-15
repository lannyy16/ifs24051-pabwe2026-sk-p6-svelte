import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { currentPath, navigate, resolveRoute } from './router';

describe('router.js', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    currentPath.set('/');
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('currentPath', () => {
    it('memiliki nilai awal berupa string', () => {
      expect(typeof get(currentPath)).toBe('string');
    });
  });

  describe('navigate', () => {
    it('mengubah path menggunakan pushState', () => {
      navigate('/dashboard');

      expect(window.location.pathname).toBe('/dashboard');
      expect(get(currentPath)).toBe('/dashboard');
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('mengubah path menggunakan replaceState', () => {
      const replaceSpy = vi.spyOn(window.history, 'replaceState');

      navigate('/profile', { replace: true });

      expect(replaceSpy).toHaveBeenCalledWith({}, '', '/profile');
      expect(get(currentPath)).toBe('/profile');
    });

    it('menggunakan pushState jika options kosong', () => {
      const pushSpy = vi.spyOn(window.history, 'pushState');

      navigate('/users', {});

      expect(pushSpy).toHaveBeenCalledWith({}, '', '/users');
      expect(get(currentPath)).toBe('/users');
    });

    it('menggunakan pushState jika replace bernilai false', () => {
      const pushSpy = vi.spyOn(window.history, 'pushState');
      const replaceSpy = vi.spyOn(window.history, 'replaceState');

      navigate('/profile', { replace: false });

      expect(pushSpy).toHaveBeenCalledWith({}, '', '/profile');
      expect(replaceSpy).not.toHaveBeenCalled();
    });

    it('menyimpan query string pada currentPath', () => {
      navigate('/users?page=2');

      expect(get(currentPath)).toBe('/users?page=2');
    });

    it('mengatur scroll ke posisi awal', () => {
      navigate('/dashboard');

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('resolveRoute', () => {
    it.each([
      ['/auth/login', { layout: 'auth', page: 'login' }],
      ['/auth/register', { layout: 'auth', page: 'register' }],
      ['/', { layout: 'app', page: 'home' }],
      ['/users', { layout: 'app', page: 'users' }],
      ['/profile', { layout: 'app', page: 'profile' }],
    ])('memetakan route %s', (path, expected) => {
      expect(resolveRoute(path)).toEqual(expected);
    });

    it('mengabaikan query string', () => {
      expect(resolveRoute('/users?page=2')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('menghapus trailing slash', () => {
      expect(resolveRoute('/users/')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('menghapus beberapa trailing slash', () => {
      expect(resolveRoute('/users///')).toEqual({
        layout: 'app',
        page: 'users',
      });
    });

    it('menggunakan home untuk path kosong', () => {
      expect(resolveRoute('')).toEqual({
        layout: 'app',
        page: 'home',
      });
    });

    it('menggunakan home untuk null', () => {
      expect(resolveRoute(null)).toEqual({
        layout: 'app',
        page: 'home',
      });
    });

    it('memetakan link tree detail', () => {
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

    it('mengembalikan not-found untuk route yang tidak dikenal', () => {
      expect(resolveRoute('/route-tidak-ada')).toEqual({
        layout: 'none',
        page: 'not-found',
      });
    });

    it('mengembalikan not-found untuk nested detail route', () => {
      expect(resolveRoute('/link-trees/123/edit')).toEqual({
        layout: 'none',
        page: 'not-found',
      });
    });
  });

  describe('popstate', () => {
    it('memperbarui currentPath saat popstate terjadi', () => {
      window.history.pushState({}, '', '/profile');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(get(currentPath)).toBe('/profile');
    });

    it('memperbarui currentPath beserta query string', () => {
      window.history.pushState({}, '', '/users?page=3');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(get(currentPath)).toBe('/users?page=3');
    });
  });
});