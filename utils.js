"use strict";

import L from "leaflet";

export const Utils = {
    /**
     * Query Select js-map
     */
    elMap: () => {
        return document.querySelectorAll('.js-map');
    },

    /**
     * Set fix z-index
     *
     * @param el
     */
    mapContainer: (el) => {
        return el.style.zIndex = '0';
    },

    /**
     * Check data
     *
     * @param data
     */
    check: (data) => {
        return (typeof data !== 'undefined' && data !== false);
    },

    /**
     * Add new attribution
     */
    attribution: () => {
        return L.control.attribution({
            prefix: ''
        });
    },

    /**
     * Set default zoom
     */
    zoom: () => {
        return {
            zoom: 13,
            max: 18,
            min: 5
        };
    },

    /**
     * Remove vecore icons
     */
    fixIcons: () => {
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
    },

    /**
     * Fix display map in tabs
     */
    tabMap: (map) => {
        const menuTabMap = document.getElementById('js-map-tab');

        if (typeof menuTabMap !== 'undefined' && menuTabMap !== null) {
            const observer = new MutationObserver(() => {
                if (menuTabMap.style.display !== 'none') {
                    map.invalidateSize();
                }
            });

            observer.observe(menuTabMap, {attributes: true});
        }
    }
};