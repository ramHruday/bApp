import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Logo from '../logo.png'

export default class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            show: 'show'
        }
    }
    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Link to="/" ><Navbar.Brand><img src={Logo} alt="bApp-logo" className="logo" />RH</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Link to="/" className="nav-link">Set-up</Link>
                        <Link to="/inventory" className="nav-link"> Inventory</Link>
                        <Link to="/dashboard" className="nav-link"> Analysis & Charts </Link>
                        <Link to="/billing" className="nav-link"> Billing </Link>
                        <Link to="/customization" className="nav-link"><i className="fas fa-cogs"></i></Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}