/**
 * You should only modify this, if you know what you are doing.
 * This phaser template is using workbox (https://developers.google.com/web/tools/workbox/)
 * to precache all assets.
 * It uses the InjectManifest function from 'workbox-webpack-plugin' inside
 * webpack/webpack.common.js
 */
import { precacheAndRoute } from 'workbox-precaching';

console.log('~~~~ Running sw.js');

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (evt) => {
    console.log('PWA install...');
    //skip cache
    evt.skipWaiting();
    return;

    evt.waitUntil(
        caches.open('static').then((cache) => {
            // prettier-ignore
            return cache.addAll([
                '/favicon.ico',
                '/index.html',
                '/main.bundle.js',
                '/manifest.json',
                '/sw.js',
                'vendors.bundle.js',
                '/icons/icons-192.png',
                '/icons/icons-512.png',
                '/assets/buttons/install.png',
                '/assets/buttons/install-focus.png',
                '/assets/buttons/start-browser.png',
                '/assets/buttons/start-browser-focus.png',
                '/assets/buttons/launch.png',
                '/assets/buttons/launch-focus.png',
                '/assets/img/coder-1.png',
                '/assets/img/coder-2.png',
                '/assets/img/fps.png',
                '/assets/img/phaser-dude.png',
                '/assets/img/phaser-logo.png'
            ]);
        })
    );
});

self.addEventListener('activate', (evt) => {
    // evt.waitUntil(
    //     caches.keys().then(function (cacheNames) {
    //         return Promise.all(
    //             cacheNames
    //                 .filter(function (cacheName) {
    //                     return true;
    //                 })
    //                 .map(function (cacheName) {
    //                     return caches.delete(cacheName);
    //                 })
    //         );
    //     })
    // );
});

self.addEventListener('fetch', (evt) => {
    console.log(' fetch...');
    console.log('activate...');
    self.caches.delete('workbox-precache-v2-http://localhost:8000/');

    // self.caches.keys().then((keys) => {
    //     keys.forEach((key) => console.log('------' + key));
    // });
    return fetch(evt.request);

    if (evt.respondWidth) {
        evt.respondWidth(
            caches.match(evt.request).then((res) => {
                if (res) {
                    console.log('... load from cache');
                    return res;
                }
                console.log('... load from internet');
                return fetch(evt.request);
            })
        );
    }
});
