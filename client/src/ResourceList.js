import React from 'react';
// import './style.css';
import {Table} from 'react-bootstrap'
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
                {resources && resources.map((r,index) => (
                    <tr key={r.id} onClick={() => showDetails(index)}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.quantity}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
)
export default ResourceList;
