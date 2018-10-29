import React from 'react';
// import './style.css';
import {Table} from 'react-bootstrap'
const ResourceList = ({resources}) => (
    <div>
        <h2>Resources</h2>
        <Table striped bordered condensed hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Resource</th>
                    <th>Quantity</th>

                </tr>
            </thead>

            <tbody>
                {resources && resources.map(r => (
                    <tr key={r.id}>
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
