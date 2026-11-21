import { defineConfig, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { visualizer } from 'rollup-plugin-visualizer';
import { makeTrails, user, conditions } from './mock/data';

// Mock API: every /api/* call waits 250-350 ms, like a real backend would.
function mockApi(): Plugin {
  const trails = makeTrails();
  const routes: Record<string, unknown> = {
    '/api/user': user,
    '/api/trails': trails,
    '/api/conditions': conditions,
  };
  const handler = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = (req.url ?? '').split('?')[0];
    if (!(path in routes)) return next();
    const delay = 250 + Math.floor(Math.random() * 101);
    setTimeout(() => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(routes[path]));
    }, delay);
  };
  return {
    name: 'trailboard-mock-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [
    mockApi(),
    // Writes bundle-report.html: a treemap of what is inside the JavaScript bundle.
    visualizer({ filename: 'bundle-report.html', template: 'treemap', gzipSize: true, brotliSize: true }),
  ],
});
