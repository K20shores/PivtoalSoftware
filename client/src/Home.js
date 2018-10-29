import React, { Component } from 'react';
import axios from 'axios'
import ResourceList from './ResourceList';
import DetailedList from './DetailedList'

import L from 'leaflet'

import {connect} from 'react-redux'
import {setMarkers} from './redux/resources'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      resources: [],
      markers: [],
      map: null,
      selectedResource: null
    }
    // this.setMarkers = this.setMarkers.bind(this)
  }
  componentDidMount(){

    //College station 30.6280° N, 96.3344° W
    const position = [30.6280, -96.334]
    const map = L.map('mapid').setView(position, 13)
    //TODO: get this from backend instead
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    setInterval(() => {

      const axiosConfig = {
        method: 'GET',
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        //   'Content-Type': 'application/json',
        // },
      }
      axios.get('http://127.0.0.1:8000/api/',axiosConfig)
      .then(response =>{
        this.props.setMarkers(response.data, map)
      })
    }, 10000);
  }

  showDetails = (i) => {
    this.setState({selectedResource: this.state.resources[i]})
  }
  hideDetails = () => {
    this.setState({selectedResource: null})
  }
  render() {
    return (
      <div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={ { width: '720px', height: '960px' }} id="mapid"></div>
          <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '10px'}}>
            <div className='card'>
              <ResourceList
                resources={this.props.resources}
                showDetails = {this.showDetails}
              />
            </div>
            <div className='card'>
              { this.state.selectedResource && 
                <DetailedList
                  selectedResource = {this.state.selectedResource}
                  hideDetails = {this.hideDetails}
                />
              }
            </div>

          </div>

        </div>
      </div>

    );
  }
}
const mapStateToProps = state => {
  return {
    resources: state.resources.resources
  }
}
export default connect(mapStateToProps,{setMarkers})(App);
