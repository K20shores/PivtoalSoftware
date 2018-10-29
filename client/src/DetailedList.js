import React from 'react';
//import './style.css';
import {Table} from 'react-bootstrap'
const DetailedList = ({selectedResource}) => (
    <div>
        <h2>Details</h2>
        <Table striped bordered condensed hover>
            <tbody>

                <tr>
                    <td>ID</td><td>{selectedResource.id}</td>
                </tr>
                <tr>
                    <td>Distance</td><td>Distance</td>
                </tr>
                <tr>
                    <td>Quantity</td><td>Distance</td>
                </tr>
                <tr>
                    <td>Quantity</td><td>Distance</td>
                </tr>
                <tr>
                    <td>Lat/Long</td><td>Distance</td>
                </tr>
                <tr>
                    <td>Dist</td><td>Distance</td>
                </tr>
                <tr>
                    <td>More Info</td><td>Distance</td>
                </tr>

            </tbody>
        </Table>
    </div>
)
export default DetailedList;
