import React,{Component} from 'react'
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

class SimpleMap extends Component{
    static defaultProps = {
        center: {
          lat: 30.62,
          lng: -96.33
        },
        zoom: 15,
        beacons: [
          {
            lat: 30.62,
            lng: -96.33,
            text: 'Me',
            severity: 1
          },
          {
            lat: 30.61,
            lng: -96.33,
            text: 'You',
            severity: 2
          }
        ]
      }
    render(){
        let {center,zoom, beacons} = this.props;
        return (
            <div style={{ height: '100vh', width: '50%' }}>
                <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCtgyO6S_Gwi8njZRtHNuBT610ZPOszidI'}}
                defaultCenter={center}
                defaultZoom={zoom}
                >
                {beacons.map(b => 
                    <Marker
                        {...b}
                    />
                ) }
                </GoogleMapReact>
            </div>
        )
        
    }
}
export default SimpleMap;