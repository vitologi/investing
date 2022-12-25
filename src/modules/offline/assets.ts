import {cacheNames} from 'workbox-core';
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {createHandlerBoundToURL} from "workbox-precaching";

export function initAssets(): void {
  // Set up App Shell-style routing, so that all navigation requests
  // are fulfilled with your index.html shell. Learn more at
  // https://developers.google.com/web/fundamentals/architecture/app-shell
  const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
  registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }: { request: Request; url: URL }) => {
      // If this isn't a navigation, skip.
      if (request.mode !== 'navigate') {
        return false;
      }

      // If this is a URL that starts with /_, skip.
      if (url.pathname.startsWith('/_')) {
        return false;
      }

      // If this looks like a URL for a resource, because it contains
      // a file extension, skip.
      if (url.pathname.match(fileExtensionRegexp)) {
        return false;
      }

      // Return true to signal that we want to use the handler.
      return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
  );

  registerRoute(
    // Match common image extensions.
    new RegExp('\\.(?:png|gif|jpg|jpeg|svg)$'),
    // Use a cache-first strategy with the following config:
    new CacheFirst({
      // You need to provide a cache name when using expiration.
      cacheName: `${cacheNames.prefix}-${'images'}-${cacheNames.suffix}`,
      plugins: [
        new ExpirationPlugin({
          // Keep at most 50 entries.
          maxEntries: 50,
          // Don't keep any entries for more than 30 days.
          maxAgeSeconds: 30 * 24 * 60 * 60,
          // Automatically cleanup if quota is exceeded.
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );
}
