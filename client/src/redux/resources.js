import L from 'leaflet'
import {icons, blackIcon} from '../Marker';
//set markers
const SET_MARKERS = 'resources/SET_MARKERS';
const INITIAL_STATE = {resources: []}
export default function reducer(state = INITIAL_STATE, action = {}){
    switch (action.type) {
        // do reducer stuff
        case SET_MARKERS:
        {
            //remove old layers
            for (let index = 0; index < state.markers; index++) {
                action.map.removeLayer(this.state.markers[index])
                
            }
        
            let newMarkers = {}
            action.resources.forEach( resource => {
                resource['location'] = {
                    'lat': resource.x_coord,
                    'lng': resource.y_coord
                }
                let m = L.marker(resource.location, {icon:  blackIcon})
                //let m = L.marker(resource.location, {icon: resource.name !== '' ? icons[resource.name] : blackIcon})
                console.log(resource);
                //console.log(m,action.map);
                m.addTo(action.map)
                m.bindPopup(`${resource.name}<br> Easily customizable.`)
                newMarkers[resource.id] = m;
            })
            return {...state, resources: action.markers}
        }
        default: return state;
    }
}

export function setMarkers(resources, map) {
    
    return {type: SET_MARKERS, resources: resources, map: map}
}
