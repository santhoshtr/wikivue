module.exports = {
    pwa: {
        // configure the workbox plugin
        workboxOptions: {
            runtimeCaching: [ {
                urlPattern: new RegExp('/.*(?:wikipedia)\.org.*$/'),
                handler: 'cacheFirst',
                options: {
                    cacheName: 'Wikipedia-api',
                    expiration: {
                        maxEntries: 1000,
                        maxAgeSeconds: 24 * 60 * 60, // A day
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }]
        }
    }
}