import 'reflect-metadata';
import {clientsClaim, setCacheNameDetails} from 'workbox-core';
import * as googleAnalytics from 'workbox-google-analytics';
import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';

import packageInfo from '../package.json';
import {initAssets} from './modules/offline/assets';

// hack for define service worker context
declare const self: ServiceWorkerGlobalScope;

setCacheNameDetails({
  prefix: packageInfo.name,
  suffix: packageInfo.version,
});

cleanupOutdatedCaches();
clientsClaim();

const generatedFiles = self.__WB_MANIFEST || [];
if (process.env.NODE_ENV === 'production') {
  precacheAndRoute(generatedFiles);
}

precacheAndRoute([
  '/manifest.json',
  '/favicon.ico',
]);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
initAssets();

// @see https://developers.google.com/web/tools/workbox/modules/workbox-google-analytics
googleAnalytics.initialize();
