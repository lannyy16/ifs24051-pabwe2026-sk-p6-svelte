// @vitest-environment node

import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';

describe('router.js dalam lingkungan Node', () => {
  it('menginisialisasi currentPath menjadi / tanpa window', async () => {
    vi.resetModules();

    const { currentPath } = await import('./router.js');

    expect(get(currentPath)).toBe('/');
  });

  it('mengubah currentPath tanpa window', async () => {
    vi.resetModules();

    const { currentPath, navigate } = await import('./router.js');

    navigate('/server-route');

    expect(get(currentPath)).toBe('/server-route');
  });
});