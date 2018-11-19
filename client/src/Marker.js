
import React from 'react'
import L from 'leaflet'

export const resourceNames = [
  "Search/Rescue",
  "Medical Team",
  "Ambulance",
  "Boat",
  "Wood (sq ft)",
  "Meals",
  "Cases of Water"
];

const srIcon = L.icon({
    iconUrl: 'S&R.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const medIcon = L.icon({
    iconUrl: 'medTeam.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const ambulanceIcon = L.icon({
    iconUrl: 'ambulance.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
const boatIcon = L.icon({
    iconUrl: 'boat.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const woodIcon = L.icon({
    iconUrl: 'wood.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
const mealIcon = L.icon({
    iconUrl: 'meals.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const waterIcon = L.icon({
    iconUrl: 'water.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

export const blackIcon = L.icon({
    iconUrl: 'black-marker-icon.png',
    iconSize:     [28, 41], // size of the icon
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -30] // point from which the popup should open relative to the iconAnchor
});

export const icons = [
    srIcon,
    medIcon,
    ambulanceIcon,
    boatIcon,
    woodIcon,
    mealIcon,
    waterIcon
]
