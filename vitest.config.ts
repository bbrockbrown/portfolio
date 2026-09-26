import path from 'path';
import { defineConfig } from 'vitest/config';

// Tests are pure TS (data invariants, filter predicate, signature determinism),
// so the default node environment is all we need — no jsdom.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts'],
  },
});
