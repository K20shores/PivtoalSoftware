import React from 'react';
//import './style.css';
import {Table} from 'react-bootstrap'
const DetailedList = ({selectedResource, hideDetails}) => (
    <div>
        <h2>D E T A I L S</h2><button onClick={hideDetails}>Hide</button>
        <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Lat</th>
                <th>Lon</th>
              </tr>
            </thead>
            <tbody>

                <tr>
                  <td>{selectedResource.id}</td>

                  <td>{selectedResource.x_coord}</td>

                  <td>{selectedResource.resource_amount}</td>

                  <td>{selectedResource.x_coord}</td>
                  <td>{selectedResource.y_coord}</td>


                </tr>

            </tbody>
        </Table>
    </div>
)
export default DetailedList;
