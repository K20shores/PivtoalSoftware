import React from 'react';
// import './style.css';
import {Table} from 'react-bootstrap'
const resourceNames = [
  "Search/Rescue team",
  "Medical Team",
  "Ambulance",
  "Boat",
  "Wood (sq ft)",
  "Meals",
  "Cases of Water"
];

const ResourceList = ({resources, showDetails}) => (
    <div>
        <h2>Resources</h2>
        <Table striped bordered condensed hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Resource</th>
                    <th>Quantity</th>
                    <th>Lat</th>
                    <th>Lon</th>
                </tr>
            </thead>

            <tbody>
                {resources && resources.map(r => {
                  return r.resource_type != -1 &&
                  (
                      <tr key={r.nodeID} onClick={() => showDetails(r.nodeID)}>
                          <td>{Math.abs(r.nodeID)}</td>
                          <td>{resourceNames[r.resource_type]}</td>
                          <td>{r.resource_amount}</td>
                          <td>{r.x_coord.toFixed(6)}</td>
                          <td>{r.y_coord.toFixed(6)}</td>
                      </tr>
                  )
                })}
            </tbody>
        </Table>
    </div>
)
export default ResourceList;
