import React from 'react';

const SeverityList = ({patients}) => (
    <div>
        <h2>Severity Ranking</h2>
        <ul>
            {patients.map(p => <li><img key={p.nodeID} src='heartbeat.png' alt='heartbeat' width={50} height={50}></img>{p.pulse}</li>)}
        </ul>
    </div>
)
export default SeverityList;