
import React from 'react'
const Marker = ({ text,severity }) => <div style={{color: severity <= 1 ? 'yellow' : 'red' }}>{text}</div>;
export default Marker;