import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');

  return {
    root,
    server: { port: 5174 },
    build: { outDir: 'dist', sourcemap: true },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE ?? 'ToolShop'),
    },
  };
});
