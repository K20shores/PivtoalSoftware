import L from 'leaflet'
import {icons, blackIcon} from '../Marker';
//set markers
const SET_MARKERS = 'resources/SET_MARKERS';
const INITIAL_STATE = {markers: [], resources:[]}
export default function reducer(state = INITIAL_STATE, action = {}){
    switch (action.type) {
        // do reducer stuff
        case SET_MARKERS:
        {
            //remove old layers
            Object.keys(state.markers).map(function(key, index) {
                action.map.removeLayer(state.markers[key])
            });
            let newMarkers = {}

            action.resources.forEach( resource => {
                resource['location'] = {
                    'lat': resource.x_coord,
                    'lng': resource.y_coord
                }
                let m = L.marker(resource.location, {icon:  blackIcon})
                //let m = L.marker(resource.location, {icon: resource.name !== '' ? icons[resource.name] : blackIcon})
                m.addTo(action.map)
                m.bindPopup(`Type: ${resource.resource_type}<br>
                  Amount:  ${resource.resource_amount} <br>
                  Lat/Long: ${resource.x_coord}/${resource.y_coord}
                  Last Updated: ${resource.time}
                    `)
                newMarkers[resource.nodeID] = m;
            })
            return {...state, markers: newMarkers, resources: action.resources}
        }
        default: return state;
    }
}

export function setMarkers(resources, map) {

    return {type: SET_MARKERS, resources: resources, map: map}
}
