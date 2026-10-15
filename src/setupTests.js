import '@testing-library/jest-dom/vitest';

// Mock API browser yang tidak tersedia secara default di jsdom.
// Lindungi akses window agar aman jika file ini dijalankan di Node.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}