
import { writable } from 'svelte/store';

const browserWindow = globalThis.window;

export const currentPath = writable(
  browserWindow
    ? `${browserWindow.location.pathname}${browserWindow.location.search}`
    : '/'
);

export function navigate(path, options = {}) {
  if (!browserWindow) {
    currentPath.set(path);
    return;
  }

  if (options.replace) {
    browserWindow.history.replaceState({}, '', path);
  } else {
    browserWindow.history.pushState({}, '', path);
  }

  currentPath.set(
    `${browserWindow.location.pathname}${browserWindow.location.search}`
  );

  browserWindow.scrollTo?.(0, 0);
}

export function resolveRoute(path) {
  const clean =
    String(path || '/').split('?')[0].replace(/\/+$/, '') || '/';

  if (clean === '/auth/login') {
    return { layout: 'auth', page: 'login' };
  }

  if (clean === '/auth/register') {
    return { layout: 'auth', page: 'register' };
  }

  if (clean === '/') {
    return { layout: 'app', page: 'home' };
  }

  if (clean === '/users') {
    return { layout: 'app', page: 'users' };
  }

  if (clean === '/profile') {
    return { layout: 'app', page: 'profile' };
  }

  const detailPattern = /^\/link-trees\/([^/]+)$/;
  const detail = detailPattern.exec(clean);

  if (detail) {
    return {
      layout: 'app',
      page: 'detail',
      linkTreeId: decodeURIComponent(detail[1]),
    };
  }

  return { layout: 'none', page: 'not-found' };
}

if (browserWindow) {
  browserWindow.addEventListener('popstate', () => {
    currentPath.set(
      `${browserWindow.location.pathname}${browserWindow.location.search}`
    );
  });
}
