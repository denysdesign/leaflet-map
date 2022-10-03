"use strict";

import axios from 'axios';
import L from "leaflet";
import {GestureHandling} from "leaflet-gesture-handling";
import {Utils} from "./utils";
import {Template} from "./template";

import 'leaflet/dist/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

require("leaflet.markercluster");

export default function render() {
    new LMap().render();
}

class LMap {
    /**
     * Constructor class
     */
    constructor(...options) {
        const option = options[0] ? options[0] : {
            map: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?lang=ru',
            copy: '&copy; <a href="https://www.openstreetmap/org/copyright">OpenStreetMap</a> contributors',
            subdomain: 'abc'
        };

        this.provider = option.map;
        this.copy = option.copy;
        this.subdomain = option.subdomain;
    }

    /**
     * Add tile Layer
     *
     * @param _this
     * @param json
     */
    static _baseMap(_this, json) {
        let tileMap = L.tileLayer(_this.provider, {
            attribution: _this.copy,
            subdomains: _this.subdomain,
            detectRetina: true
        });

        if (typeof json.map !== 'undefined') {
            tileMap = L.tileLayer(json.map.provider, {
                attribution: json.map.copy,
                subdomains: json.map.subdomain,
                detectRetina: true
            })
        }

        return tileMap;
    }

    /**
     * Render map
     */
    render() {
        Utils.elMap().forEach((el) => {
            const jsonDataset = el.dataset.jsMap,
                json = JSON.parse(jsonDataset);

            if (json.type === 'single') {
                this._single(json, el);
            }

            if (json.type === 'multi') {
                this._multi(json, el);
            }

            if (json.type === 'json') {
                this._json(json, el);
            }
        });
    }

    /**
     * Ajax JSON load data
     *
     * @param json
     * @param el
     */
    _json(json, el) {

        let mZoom = json.zoom ? json.zoom : Utils.zoom(),
            dataMap = {},
            url = json.json;

        Utils.fixIcons();
        Utils.mapContainer(el);

        axios.get(url).then(response => {
            dataMap = {...response.data};

            let markerArray = [],
                marker,
                markers,
                dataMarker = [],
                markerCluster = json.cluster ? json.cluster : false,
                totalLat = 0,
                totalLng = 0,
                lengthGeo = Object.keys(dataMap).length;

            for (let i = 0; i < lengthGeo; i++) {
                markerArray.push(L.marker([dataMap[i].lat, dataMap[i].lng]));
                totalLat += parseFloat(dataMap[i].lat);
                totalLng += parseFloat(dataMap[i].lng);
            }

            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

            let map = L.map(el, {
                    attributionControl: false,
                    zoom: mZoom.zoom,
                    minZoom: mZoom.min,
                    maxZoom: mZoom.max,
                    gestureHandling: true
                }),
                defaultCenter = [totalLat / lengthGeo, totalLng / lengthGeo],
                group = L.featureGroup(markerArray).getBounds(),
                rectIcon = L.icon({
                    iconUrl: Template.pinSVG(),
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50],
                    tooltipAnchor: [16, -28],
                });

            map.fitBounds(group);
            map.setView(defaultCenter);

            Utils.attribution().addTo(map);
            LMap._baseMap(this, json).addTo(map);

            if (markerCluster === true) {
                markers = L.markerClusterGroup({
                    iconCreateFunction: (cluster) => {
                        return Template.clusterIcons(cluster);
                    }
                });
            }

            for (let key in dataMap) {
                dataMarker = dataMap[key];
                marker = L.marker(
                    [
                        dataMarker.lat,
                        dataMarker.lng
                    ], {
                        icon: rectIcon
                    }
                );

                const popUp = Template.popUpContent(dataMarker);

                marker.bindPopup(popUp);

                if (markerCluster === true) {
                    markers.addLayer(marker);
                } else {
                    marker.addTo(map);
                }
            }

            if (markerCluster === true) {
                map.addLayer(markers);
            }

            map.invalidateSize();
        });
    }

    /**
     * Data in application/json tag script
     *
     * @param json
     * @param el
     */
    _multi(json, el) {

        const jsonNode = document.getElementById(json.data),
            jsonText = jsonNode.textContent,
            dataMap = JSON.parse(jsonText);

        let markerArray = [],
            marker,
            markers,
            dataMarker,
            markerCluster = json.cluster ? json.cluster : false,
            mZoom = json.zoom ? json.zoom : Utils.zoom(),
            totalLat = 0,
            totalLng = 0;

        Utils.fixIcons();
        Utils.mapContainer(el);

        for (let i = 0; i < dataMap.length; i++) {
            markerArray.push(L.marker([dataMap[i].lat, dataMap[i].lng]));

            totalLat += parseFloat(dataMap[i].lat);
            totalLng += parseFloat(dataMap[i].lng);
        }

        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

        let map = L.map(el, {
                attributionControl: false,
                zoom: mZoom.zoom,
                minZoom: mZoom.min,
                maxZoom: mZoom.max,
                gestureHandling: true
            }),
            defaultCenter = [totalLat / dataMap.length, totalLng / dataMap.length],
            group = L.featureGroup(markerArray).getBounds(),
            rectIcon = L.icon({
                iconUrl: Template.pinSVG(),
                iconAnchor: [25, 50],
                popupAnchor: [0, -50],
                tooltipAnchor: [16, -28],
            });

        map.fitBounds(group);
        map.setView(defaultCenter);

        Utils.attribution().addTo(map);
        LMap._baseMap(this, json).addTo(map);

        if (markerCluster === true) {
            markers = L.markerClusterGroup({
                iconCreateFunction: (cluster) => {
                    return Template.clusterIcons(cluster);
                }
            });
        }

        for (let index = 0; index < dataMap.length; index++) {

            dataMarker = dataMap[index];
            marker = L.marker([
                dataMarker.lat,
                dataMarker.lng
            ], {
                icon: rectIcon
            });

            let popUp = Template.popUpContent(dataMarker);

            marker.bindPopup(popUp);

            if (markerCluster === true) {
                markers.addLayer(marker);
            } else {
                marker.addTo(map);
            }
        }

        if (markerCluster === true) {
            map.addLayer(markers);
        }

        map.invalidateSize();
    }

    /**
     * Single pin from data-attribute
     *
     * @param json
     * @param el
     */
    _single(json, el) {
        Utils.fixIcons();
        Utils.mapContainer(el);

        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

        let map = L.map(el, {
                attributionControl: false,
                zoom: json.zoom.zoom,
                minZoom: json.zoom.min,
                maxZoom: json.zoom.max,
                gestureHandling: true
            }),
            defaultCenter = [Number(json.data.setting.lat), Number(json.data.setting.lng)],
            rectIcon = L.icon({
                iconUrl: Template.pinSVG(),
                iconAnchor: [25, 50],
                popupAnchor: [0, -50],
                tooltipAnchor: [16, -28],
            }),
            marker = L.marker(defaultCenter, {icon: rectIcon}),
            popUp = Template.popUpContent(json.data.info);

        marker.bindPopup(popUp);
        map.setView(defaultCenter, json.zoom.zoom);

        Utils.attribution().addTo(map);
        LMap._baseMap(this, json).addTo(map);

        marker.addTo(map);
        map.invalidateSize();

        Utils.tabMap();
    }
}