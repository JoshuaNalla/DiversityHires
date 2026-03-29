import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: {
        // High-level WebSocket proxy to bypass 1008 api-key auth failures
        '/api/elevenlabs-ws': {
          target: 'wss://api.elevenlabs.io',
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/elevenlabs-ws/, ''),
          configure: (proxy, options) => {
             // Inject ElevenLabs API Key via pure WebSocket headers
             proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
               if (env.VITE_ELEVENLABS_API_KEY) {
                 proxyReq.setHeader('xi-api-key', env.VITE_ELEVENLABS_API_KEY);
               }
             });
          }
        }
      }
    }
  };
});
