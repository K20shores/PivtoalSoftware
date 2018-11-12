import React from 'react';
//import './style.css';
import {Table,Button} from 'react-bootstrap'
const DetailedList = ({selectedResource, hideDetails}) => (
    <div>
        <h2>Details</h2><Button bsStyle="primary" onClick={hideDetails}>Hide</Button>
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
