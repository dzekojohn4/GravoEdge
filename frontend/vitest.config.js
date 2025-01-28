import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    alias: {
      '^src/(.*)$': './src/$1',
      '\\.svg\\?react$': './test/__mocks__/svgMock.js',
      '\\.svg$': './test/__mocks__/svgMock.js',
      '\\.css$': './test/__mocks__/styleMock.js',
    },
  },
});
