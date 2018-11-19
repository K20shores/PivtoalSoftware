
import React from 'react'
import L from 'leaflet'
const Marker = ({ text,severity }) => <div style={{color: severity <= 1 ? 'yellow' : 'red' }}>{text}</div>;
export default Marker;

//scale markers with zoom
//find better icon.
//zoom issue
//expand resources to bordered
//border on the left side

const bandagesIcon = L.icon({
    iconUrl: 'green-marker-icon.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [28, 41], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const blanketsIcon = L.icon({
    iconUrl: 'yellow-marker-icon.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [28, 41], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const foodIcon = L.icon({
    iconUrl: 'red-marker-icon.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [28, 41], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

export const blackIcon = L.icon({
    iconUrl: 'black-marker-icon.png',
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [28, 41], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

export const icons = [
    
]
