import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const src = (p = '') => path.resolve(import.meta.dirname, 'src', p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: src() },
      { find: '@app', replacement: src('app') },
      { find: '@pages', replacement: src('pages') },
      { find: '@widgets', replacement: src('widgets') },
      { find: '@features', replacement: src('features') },
      { find: '@entities', replacement: src('entities') },
      { find: '@shared', replacement: src('shared') },
    ],
  },
  build: {
    target: 'es2022',
  },
});