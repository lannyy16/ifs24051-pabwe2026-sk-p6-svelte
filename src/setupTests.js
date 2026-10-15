
import '@testing-library/jest-dom/vitest';

// Mock API browser yang tidak tersedia secara default di jsdom.
const browserWindow = globalThis.window;

if (browserWindow) {
  Object.defineProperty(browserWindow, 'matchMedia', {
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
