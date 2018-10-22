import React from 'react'
import {Navbar,Nav,NavItem} from 'react-bootstrap'
const MyNavBar = () => (
    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
            <a href="/">Resource Tracker</a>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <NavItem eventKey={1} href="/">
            Home
            </NavItem>
            <NavItem eventKey={2} href="about">
            About
            </NavItem>
        </Nav>
    </Navbar>
)
export default MyNavBar