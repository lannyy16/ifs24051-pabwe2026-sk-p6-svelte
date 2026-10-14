import { writable } from 'svelte/store';
export const currentPath = writable(typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`);
export function navigate(path, options = {}) {
  if (typeof window !== 'undefined') {
    if (options.replace) window.history.replaceState({}, '', path);
    else window.history.pushState({}, '', path);
    currentPath.set(`${window.location.pathname}${window.location.search}`);
    window.scrollTo?.(0, 0);
  } else currentPath.set(path);
}
export function resolveRoute(path) {
  const clean = String(path || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (clean === '/auth/login') return { layout:'auth', page:'login' };
  if (clean === '/auth/register') return { layout:'auth', page:'register' };
  if (clean === '/') return { layout:'app', page:'home' };
  if (clean === '/users') return { layout:'app', page:'users' };
  if (clean === '/profile') return { layout:'app', page:'profile' };
  const detail = clean.match(/^\/link-trees\/([^/]+)$/);
  if (detail) return { layout:'app', page:'detail', linkTreeId: decodeURIComponent(detail[1]) };
  return { layout:'none', page:'not-found' };
}
if (typeof window !== 'undefined') window.addEventListener('popstate', () => currentPath.set(`${window.location.pathname}${window.location.search}`));
