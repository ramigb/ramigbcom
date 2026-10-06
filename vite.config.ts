import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // three's WebGLRenderer is most of the bundle (~215 kB gzipped) and can't be split
  // usefully: nothing renders without it.
  build: { chunkSizeWarningLimit: 900 },
  server: {
    // Windows drives mounted in WSL don't deliver file events; poll instead.
    watch: process.env.WSL_DISTRO_NAME ? { usePolling: true, interval: 300 } : undefined,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
