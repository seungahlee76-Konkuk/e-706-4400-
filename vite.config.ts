import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {ROUTE_META} from './src/lib/seoRoutes';

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function staticPrerenderPlugin(): Plugin {
  return {
    name: 'static-prerender-routes',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      for (const route of Object.values(ROUTE_META)) {
        let html = templateHtml;

        const safeTitleText = escapeHtmlText(route.title);
        const safeTitleAttr = escapeHtmlAttr(route.title);
        const safeDescAttr = escapeHtmlAttr(route.description);
        const safeCanonical = escapeHtmlAttr(route.canonical);

        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitleText}</title>`);
        html = html.replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${safeCanonical}" />`,
        );
        html = html.replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${safeDescAttr}" />`,
        );
        html = html.replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${safeTitleAttr}" />`,
        );
        html = html.replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${safeDescAttr}" />`,
        );
        html = html.replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${safeCanonical}" />`,
        );
        html = html.replace(
          /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
          `<meta name="twitter:title" content="${safeTitleAttr}" />`,
        );
        html = html.replace(
          /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="twitter:description" content="${safeDescAttr}" />`,
        );

        const webPageJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: route.canonical,
          name: route.title,
          description: route.description,
          inLanguage: 'ko',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: route.breadcrumbs.map((b, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: b.name,
              item: b.item,
            })),
          },
        };

        const ldScript = `    <script type="application/ld+json">${JSON.stringify(webPageJsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`;
        html = html.replace('</head>', ldScript);

        html = html.replace('<div id="root"></div>', `<div id="root">${route.prerenderHtml.trim()}</div>`);

        const outFile =
          route.path === '/'
            ? indexHtmlPath
            : path.join(distDir, route.path.replace(/^\/+/, ''), 'index.html');

        fs.mkdirSync(path.dirname(outFile), {recursive: true});
        fs.writeFileSync(outFile, html, 'utf-8');
      }
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), staticPrerenderPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
