(function ServiceWorker() {
	"use strict";

    let swRegistration;

    document.addEventListener("DOMContentLoaded",ready,false);

	initServiceWorker().catch(console.error);

    function ready() {
        console.log('Web App is loaded');
    }

    async function initServiceWorker() {
        // Feature detect for Service Worker API
        if ("serviceWorker" in navigator) {
            // This will run serviceworker.js
            swRegistration = await navigator.serviceWorker.register('serviceworker.js');
        }
    }

})();
