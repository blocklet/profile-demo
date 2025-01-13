importScripts('/.well-known/service/static/share/shared-service-worker.js');

const { strategies, precaching, core, routing } = self.blocklet.workbox;

precaching.precacheAndRoute(
  (self.__WB_MANIFEST || []).filter((x) => x.url !== 'index.html').map(self.blocklet.fixRouteUrl),
);

routing.registerRoute(
  new routing.Route(
    ({ request, url }) => {
      if (!self.blocklet.canCache({ url })) return false;
      return ['image', 'font', 'style', 'script'].includes(request.destination);
    },
    new strategies.CacheFirst({
      cacheName: `static-resources-${self.registration.scope}`,
    }),
  ),
);

routing.registerRoute(
  new routing.Route(
    ({ request, url }) => {
      if (!self.blocklet.canCache({ url })) return false;
      return request.method === 'GET';
    },
    new strategies.NetworkFirst({
      cacheName: `others-${self.registration.scope}`,
    }),
  ),
);

self.skipWaiting();
core.clientsClaim();
