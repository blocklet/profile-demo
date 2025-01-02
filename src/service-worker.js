self.routes = self.__WB_MANIFEST || [];
importScripts('/.well-known/service/static/share/shared-service-worker.js');

routing.registerRoute(
  new routing.Route(
    ({ request }) => {
      return ['image', 'font', 'style', 'script'].includes(request.destination);
    },
    new strategies.CacheFirst({
      cacheName: `static-resources-${self.registration.scope}`,
    }),
  ),
);

routing.registerRoute(
  new routing.Route(
    () => true,
    new strategies.NetworkFirst({
      cacheName: `others-${self.registration.scope}`,
    }),
  ),
);
