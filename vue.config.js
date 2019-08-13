module.exports = {
    pwa: {
        themeColor: "#FFFFFF",
        msTileColor: '#000000',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        appleMobileWebAppCapable: 'yes',
        // configure the workbox plugin
        workboxOptions: {
            runtimeCaching: [ {
                urlPattern: new RegExp('^https://.*\.wikipedia\.org/api/'),
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
            },
            {
                urlPattern: new RegExp('^https://upload\.wikimedia\.org/wikipedia/commons/'),
                handler: 'cacheFirst',
                options: {
                    cacheName: 'Wikipedia-commons',
                    expiration: {
                        maxEntries: 10000,
                        maxAgeSeconds: 7 * 24 * 60 * 60, // A week
                    },
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }]
        }
    }
}