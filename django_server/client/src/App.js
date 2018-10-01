import React, { Component } from 'react';
import SimpleMap from './SimpleMap';
import SeverityList from './SeverityList';
import L from 'leaflet'
const patients = [
  {
    pulse: 120
  },
  {
    pulse: 40
  },
  {
    pulse: 180
  },
  {
    pulse: 0
  }
]

class App extends Component {
  componentDidMount(){
    //College station
    //30.6280° N, 96.3344° W
    const position = [30.6280, -96.334]
    const map = L.map('mapid').setView(position, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    
    L.marker(position)
      .addTo(map)
      .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
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
