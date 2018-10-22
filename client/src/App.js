import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './Home'
import About from './About'
import NavBar from './NavBar'
const App = () => (
    <Router>
        <div>
            <NavBar/>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
        </div>
        
    </Router>
)
export default App;