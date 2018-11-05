import React from 'react';
// import './style.css';
import {Table} from 'react-bootstrap'
const ResourceList = ({resources}) => (
    <div>
        <h2>R E S O U R C E S</h2>
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
                        <td>{r.resource_type}</td>
                        <td>{r.resource_amount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
)
export default ResourceList;
