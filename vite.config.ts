import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Local API proxy — same paths as production (https://odi.studio/payments, /auth, …).
  // IMPORTANT: `/products` must NOT steal public assets like `/products-banner.png`.
  // Bypass any request that looks like a static file.
  server: {
    proxy: (() => {
      const target = 'http://127.0.0.1:5000';
      const bypass = (req: { url?: string; method?: string; headers?: Record<string, string | string[] | undefined> }) => {
        const url = req.url ?? '';
        if (/\.(png|jpe?g|webp|gif|svg|mp4|ico|txt|html|css|js|map)(\?.*)?$/i.test(url)) {
          return url;
        }
        // Full page loads / refreshes (browser navigation) ask for text/html — let the
        // Vite dev server serve index.html so client-side routing (e.g. /products) works.
        // Real API calls from app code send Accept: application/json (or */*), so they
        // still get proxied to the backend.
        const accept = req.headers?.accept;
        const acceptsHtml = Array.isArray(accept) ? accept.some((a) => a.includes('text/html')) : accept?.includes('text/html');
        if ((req.method ?? 'GET') === 'GET' && acceptsHtml) {
          return url;
        }
      };
      const api = { target, changeOrigin: true, bypass };
      return {
        '/health': api,
        '/auth': api,
        '/user': api,
        '/users': api,
        '/products': api,
        '/reviews': api,
        '/cart': api,
        '/coupons': api,
        '/checkout': api,
        '/orders': api,
        '/payments': api,
        '/shipping': api,
        '/admin': api,
        '/contact': api,
        '/careers': api,
      };
    })(),
  },
})
