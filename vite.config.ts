import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
  },
  resolve: {
    alias: [
      { find: '@modules', replacement: path.resolve(__dirname, './apps/ai-platform/src/modules') },
      { find: '@idg/ui', replacement: path.resolve(__dirname, './src/components/idg-ui/index.tsx') },
      { find: '@idg/realtime', replacement: path.resolve(__dirname, './src/services/firebase/listeners/sharedListener.ts') },
      { find: '@idg/domain', replacement: path.resolve(__dirname, './src/shared/domain/customs/types.ts') },
      { find: '@/shared/ui', replacement: path.resolve(__dirname, './src/components/ui') },
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ],
  },
  server: {
    port: 3000,
    hmr: false,
  },
})
