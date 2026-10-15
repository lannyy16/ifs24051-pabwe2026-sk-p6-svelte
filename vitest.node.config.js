import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: [],
    include: ['src/router.node.test.js'],
    fileParallelism: false,
  },
});