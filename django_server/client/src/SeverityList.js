import React from 'react';

const SeverityList = ({patients}) => (
    <div>
        <h2>Severity Ranking</h2>
        <ul>
            {patients.map(p => <li><img src='./heartbeat.png'></img>{p.pulse}</li>)}
        </ul>
    </div>
)
export default SeverityList;