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
            <h3> png Sources </h3>
            <div>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Ambulance">Ambulance</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Health care">Health care</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Rescue Boat">Rescue Boat</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/epiccoders" title="Lifesaver">Lifesaver</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Wood">Wood</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/vectors-market" title="Water">Water</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
