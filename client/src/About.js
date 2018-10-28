import React from 'react'
import './style.css'

const people = [
    {
        'name' : 'jonathon',
        'description': 'I built the frontend and helped write the mongodb connection',
        'linkedInUrl': 'https://www.linkedin.com/in/aggies2018/'
    },
    {
        'name' : 'kyle',
        'description': 'I built the hardware',
        'linkedInUrl': 'https://www.linkedin.com/in/shoreskyle/'
    },
    {
        'name' : 'cullen',
        'description': 'I built the hardware too',
        'linkedInUrl': 'https://www.linkedin.com/in/aggies2018/'
    },
    {
        'name' : 'brandon',
        'description': 'I built the hardware',
        'linkedInUrl': 'https://www.linkedin.com/in/aggies2018/'
    },
    {
        'name' : 'steve',
        'description': 'I built the parser',
        'linkedInUrl': 'https://www.linkedin.com/in/aggies2018/'
    }
]
const About = () => (
    <div>
        <div className='card'>
            <h2>Project Description</h2>
            <p>This project is about tracking resources in crisis situations</p>
        </div>
        {people.map(p => (
            <div className='business-card'>
                <img src={`${p.name}.jpg`} alt={p.name}/>
                <p>{p.description}</p>
            
            </div>
        )
        )}
        
    </div>
);
export default About;