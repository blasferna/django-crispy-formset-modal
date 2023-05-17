import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'js/src/index.js'),
      name: 'crispyFormsetModal',
      formats: ["iife"],
      fileName: () => `crispy-formset-modal.min.js`,
    },
    outDir: 'crispy_formset_modal/static/crispy_formset_modal/js/',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      ecma: 5,
    },
    rollupOptions: {
      external: ['jquery'],
    },
  },
});
