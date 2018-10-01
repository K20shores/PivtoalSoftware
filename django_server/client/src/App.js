import React, { Component } from 'react';
import SimpleMap from './SimpleMap';
import SeverityList from './SeverityList';

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
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  }
  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
         <div style={ { height: '180px' }} id="mapid"></div>
        <SeverityList
          patients={patients}
        />
      </div>
    );
  }
}

export default App;
