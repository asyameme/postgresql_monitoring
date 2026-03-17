import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': './src',
    },
  },
  base: mode === 'production' ? '/postgresql_monitoring/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}))
