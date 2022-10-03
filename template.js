"use strict";

import {Utils} from "./utils";
import {Point} from "leaflet";
import {DivIcon} from "leaflet";

export const Template = {
    /**
     * Add cluster svg icon
     *
     * @param color
     */
    clusterSVG: (color = '#1971ff') => {
        const encoded = window.btoa(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-150 -150 300 300"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.4"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.3"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.2"/></g></defs><circle r="149" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-width="1px" stroke-opacity="0.5"/><g fill="${color}"><circle r="41"/><g><use xlink:href="#a"/></g><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>`);

        return (`data:image/svg+xml;base64,${encoded}`);
    }, clusterIcons: (cluster) => {
        let childCount = cluster.getChildCount(),
            c = ' marker-cluster2-',
            clasterColor,
            size;

        if (childCount < 10) {
            c += 'small';
            size = 100;
            clasterColor = '#1971ff';
        } else if (childCount < 100) {
            c += 'medium';
            size = 140;
            clasterColor = '#ffa50f';
        } else {
            c += 'large';
            size = 160;
            clasterColor = '#d1200d';
        }

        const icon = Template.clusterSVG(clasterColor);

        return new DivIcon({
            html: `<div style="background: no-repeat url(${icon}); width: ${size}px; height: ${size}px;"><span>${childCount}</span></div>`,
            className: 'marker-cluster2' + c,
            iconSize: new Point(size, size)
        });
    }, /**
     * Add svg icon pin
     *
     * @param data
     */
    pinSVG: (data = false) => {
        let styleIcon,
            svgIcon,
            style_1 = '#ff3501',
            style_2 = '#cd2a00';

        styleIcon.style_2 = undefined;
        styleIcon.style_1 = undefined;

        if (typeof data[0] !== 'undefined') {
            styleIcon = data[0].style ? data[0].style : '';
            svgIcon = data[0].svg ? data[0].svg : '';
        }

        if (Utils.check(styleIcon)) {
            style_1 = styleIcon.style_1;
            style_2 = styleIcon.style_2;
        }

        let encoded = window.btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M24,0V10.3a7.9,7.9,0,0,1,0,15.8V48L38.45,29.83a18.2,18.2,0,0,0,4-11.41A18.44,18.44,0,0,0,24,0Z" fill="${style_2}"/><path d="M31.9,18.2A7.92,7.92,0,0,0,24,10.3V26.1A7.92,7.92,0,0,0,31.9,18.2Z" fill="#d8d7da"/><path d="M16.1,18.2A7.92,7.92,0,0,1,24,10.3V0A18.44,18.44,0,0,0,5.58,18.42a18.2,18.2,0,0,0,4,11.41L24,48V26.1A7.92,7.92,0,0,1,16.1,18.2Z" fill="${style_1}"/><path d="M16.1,18.2A7.92,7.92,0,0,0,24,26.1V10.3A7.92,7.92,0,0,0,16.1,18.2Z" fill="#fff"/></svg>`);

        if (Utils.check(svgIcon)) {
            encoded = window.btoa(svgIcon);
        }

        return (`data:image/svg+xml;base64,${encoded}`);
    }, /**
     * PopUp baloon
     *
     * @param data
     */
    popUpContent: (data) => {
        let content,
            title,
            address,
            desc;

        if (data.title) {
            title = `<h3 class="uk-h5 uk-margin-small-bottom">${data.title}</h3>`;
        }

        if (data.address) {
            address = `<div class="tm-text-steel uk-grid uk-grid-collapse" data-uk-grid><div class="uk-width-auto"><svg width="15" height="15" class="tm-margin-xsmall-right" aria-hidden="true"><use xlink:href="/app/icons/icons.svg#i-loc"></use></svg></div><div class="uk-width-expand">${data.address}</div></div>`;
        }

        if (data.description) {
            desc = `<div class="uk-margin-small">${data.description}</div>`;
        }

        content = `${title}${desc}${address}`;

        if (data.link) {
            content = `<a href="${data.link}" class="uk-link-reset uk-display-block">${title}${desc}${address}</a>`;
        } else if (data.gmap) {
            content = `<a href="${data.gmap}" class="uk-link-reset uk-display-block">${title}${desc}${address}</a>`;
        }

        return `<div class="tm-map-popup tm-font-xxsmall uk-width-medium">${content}</div>`;
    }
};