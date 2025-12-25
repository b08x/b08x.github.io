import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'GardenWidgets',
      fileName: (format) => `garden-widgets.${format}.js`,
    },
    outDir: 'assets/js/dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [], // Add external deps if you want to load them via CDN instead
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
