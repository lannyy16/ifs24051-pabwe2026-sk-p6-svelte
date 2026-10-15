
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [tailwindcss(), svelte()],

    resolve: {
      conditions: ['browser'],
    },

    ssr: {
      noExternal: ['svelte'],
    },

    server: {
      host: '0.0.0.0',
      port: Number(env.APP_PORT || 3004),
    },

    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.js'],
      fileParallelism: false,

      server: {
        deps: {
          inline: ['svelte'],
        },
      },

      coverage: {
        provider: 'v8',

        include: ['src/**/*.js'],

        exclude: [
          'src/main.js',
          'src/setupTests.js',
          'src/**/*.test.js',
        ],

        // Laporan untuk terminal, HTML, dan SonarQube.
        reporter: ['text', 'html', 'lcov'],

        // Pertahankan target coverage yang sudah ada.
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  };
});
