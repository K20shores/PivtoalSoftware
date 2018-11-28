import React from 'react';
//import './style.css';
import {Table,Button} from 'react-bootstrap'

const resourceNames = [
    {"name": "Search/Rescue", icon:'S&R.png'},
    {"name": "Medical Team", icon:'medTeam.png'},
    {"name": "Ambulance", icon:'ambulance.png'},
    {"name": "Boat", icon:'boat.png'},
    {"name": "Wood (sq ft)", icon:'wood.png'},
    {"name": "Meals", icon:'meals.png'},
    {"name": "Cases of Water", icon:'water.png'},
];

const Legend = () => (
    <div>
        <h2>Legend</h2>
        <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>                
                {resourceNames.map(r => {
                    return <tr>
                        <td>{r.name}</td>

                        <td><img src={r.icon} alt={r.name} width="50px" height="50px"/></td>
                    </tr>
                })}
            </tbody>
        </Table>
    </div>
)
export default Legend;
