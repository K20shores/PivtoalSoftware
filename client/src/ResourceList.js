import React from 'react';
// import './style.css';
import {Table} from 'react-bootstrap'
const ResourceList = ({resources, popOver}) => (
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
                {resources && resources.map(r => (
                    <tr key={r.nodeID} onClick={() => popOver(r.nodeID)}>
                        <td>{r.nodeID}</td>
                        <td>{r.resource_type}</td>
                        <td>{r.resource_amount}</td>
                        <td>{r.x_coord}</td>
                        <td>{r.y_coord}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
)
export default ResourceList;
