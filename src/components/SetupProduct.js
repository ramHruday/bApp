import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Product from './Product';
import Supplier from './Supplier';
import Location from './Location';
import Brands from './Brands';

export default class SetupProduct extends Component {
    render() {
        return (
            <div className="p-3">
                <Tab.Container id="left-tabs-example" defaultActiveKey="products">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="products">Products</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="suppliers">Suppliers</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="locations">Locations</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="brands">Brands</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="products">
                                    <Product />
                                </Tab.Pane>
                                <Tab.Pane eventKey="suppliers">
                                    <Supplier />
                                </Tab.Pane>
                                <Tab.Pane eventKey="locations">
                                    <Location />
                                </Tab.Pane>
                                <Tab.Pane eventKey="brands">
                                    <Brands />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}
