import React, { Component } from 'react';
import axios from 'axios'
import ResourceList from './ResourceList';
import DetailedList from './DetailedList'

import L from 'leaflet'
import {icons, blackIcon} from './Marker';
const resources = [
  {
    location: [30.6280, -96.334],
    quantity: 100,
    name: 'bandages'
  },
  {
    location: [30.5910, -96.3640],
    quantity: 100,
    name: 'food'
  },
  {
    location: [30.6280, -96.350],
    quantity: 100,
    name: 'water'
  },
  {
    location: [30.659, -96.334],
    quantity: 100,
    name: 'blankets'
  }
]

class App extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidMount(){

    //College station 30.6280° N, 96.3344° W
    const position = [30.6280, -96.334]
    const map = L.map('mapid').setView(position, 13)

    //TODO: get this from backend instead
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    /*
    axios.get('http://localhost:8000/api/',{
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
    )
    .then(response =>{
      console.log(response.data)
    })
    */
    console.log(L)
    // resources.forEach( resource => {
    //   L.marker(resource.location, {icon: resource.name !== '' ? icons[resource.name] : blackIcon})
    //     .addTo(map)
    //     .bindPopup(`${resource.name}<br> Easily customizable.`)
    // })
    
  }
  render() {
    return (
      <div>
        
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={ { width: '720px', height: '960px' }} id="mapid"></div>
          <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '10px'}}>
            <div className='card'>
              <ResourceList
                resources={resources}
              />
            </div>
            <div className='card'>
              <DetailedList
                selectedResource = {this.state.selectedResource}
              />
            </div>
            
          </div>
          
        </div>
      </div>
      
    );
  }
}

export default App;
