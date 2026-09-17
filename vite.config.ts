import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

const entry = fileURLToPath(new URL('src/index.ts', import.meta.url));

/**
 * Peer packages that must never be bundled into the library output.
 * The consuming app supplies its own React so there is only ever one copy.
 */
const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
      insertTypesEntry: true,
    }),
  ],
  css: {
    modules: {
      // Deterministic, collision-safe class names in the shipped stylesheet.
      generateScopedName: 'engen-[local]-[hash:base64:5]',
    },
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    // One stylesheet for the whole library instead of a file per chunk.
    cssCodeSplit: false,
    lib: {
      entry,
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'cjs' ? 'index.cjs' : 'index.js'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external,
      output: {
        // Every component is interactive, so flag the whole entry as a
        // client module for React Server Component consumers (Next.js).
        banner: '"use client";',
        exports: 'named',
        // Keep the single stylesheet at dist/styles.css (see lib.cssFileName).
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith('.css'))
            ? 'styles.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/**/index.ts',
      ],
    },
  },
});
