import React from 'react';
import './style.css';

const ResourceList = ({resources}) => (
    <div>
        <h2>Resources</h2>
        <table >
            <thead>
                <tr>
                    <th>id</th>
                    <th>Resource</th> 
                    <th>Quantity</th>
                    
                </tr>
            </thead>
        
            <tbody>
                {resources.map(r => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.quantity}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
export default ResourceList;