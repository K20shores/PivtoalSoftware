import React, { Component } from 'react';
import SimpleMap from './SimpleMap';
import SeverityList from './SeverityList';
import L from 'leaflet'
import {icons, blackIcon} from './Marker';
const patients = [
  {
    location: [30.6280, -96.334],
    severity: 1,
    pulse: 120
  },
  {
    location: [30.5910, -96.3640],
    severity: 0,
    pulse: 40
  },
  {
    location: [30.6280, -96.350],
    severity: 2,
    pulse: 180
  },
  {
    location: [30.659, -96.334],
    severity: -1,
    pulse: 0
  }
]

class App extends Component {
  componentDidMount(){

    //College station 30.6280° N, 96.3344° W
    const position = [30.6280, -96.334]
    const map = L.map('mapid').setView(position, 13)

    //TODO: get this from backend instead
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    
    patients.forEach( patient => {
      L.marker(patient.location, {icon: patient.severity != -1 ? icons[patient.severity] : blackIcon})
        .addTo(map)
        .bindPopup(`${patient.pulse}<br> Easily customizable.`)
    })
    
  }
  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={ { width: '720px', height: '960px' }} id="mapid"></div>
        <SeverityList
          patients={patients}
        />
      </div>
    );
  }
}

export default App;
