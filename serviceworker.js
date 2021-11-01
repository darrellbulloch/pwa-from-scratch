"use strict";

const version = "1.0.0"; // Change this at each deployment so that the Browser 
                         // detects a change an loads the new version of the service worker

// These are URLs, not filename
// Sometimes there is no need to cache certain resources not used by the app itself, 
// like icons and app manifest - they are like meta data used to install the app
const assets = [
    "/", // the default resource served by this URL, like index.html
    "app.js",
    "styles.css",
    "serviceworker-register.js",
    "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
    "app.webmanifest",
    "icons/icon-512.png" 
];

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);

main().catch(console.error);

async function main() {
    console.log(`Service Worker (${version}) is starting...`);
    // skip the waiting phase
    self.skipWaiting();

}

async function onInstall(evt) {
    console.log(`Service Worker (${version}) installed.`);

    // Cache resources needed for the app to work offline.
    // Be sure to ask the Browser to wait until this task is done
    // so that it doesn't kill the service worker after some period of idle time
    // where it could still be busy downloading 
    evt.waitUntil(
        caches.open("assets")
            .then((cache) => {
                cache.addAll(assets);
            })
    );
}

function onActivate(evt) {
    evt.waitUntil(
        handleActivation()
    );
}

async function handleActivation(evt) {
    await clients.claim();
    console.log(`Service Worker (${version}) is activated.`);
}

function onFetch(evt) {
    // respondWith receives either
    //   a Response (synchronous response) 
    //   or Promise<Response> (async response)

    // MUST always respond with evt.respondWith - FROM ALL PATHS OF THE CODE

    if (evt.url === "https://localhost:5000/fake") {
        const response = new Response(`Hello, I am a Response on URL ${evt.request.url}.`);
        evt.respondWith(response);
    } else {
        evt.respondWith(
            caches.open("assets")
            .then((cache) => {
                return cache.match(evt.request);
            })
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Cache Hit
                    return cachedResponse;
                } else {
                    // Cache Miss
                    return fetch(evt.request);
                }
            })
        );
    }
}
