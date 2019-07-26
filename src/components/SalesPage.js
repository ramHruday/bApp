import React, { Component } from 'react';
// import httpServiceLayer from '../services/http-service-layer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import upImage from '../assets/images/up.png'
// import ReactEcharts from 'echarts-for-react';

export default class SalesPage extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className="p-2">
                    <Card className="col-3">
                        <Card.Body>
                            <Card.Title>Status</Card.Title>
                            <p>
                                10% Increase in sales.
                            </p>
                            <p>
                              - Last Week July
                            </p>
                            <i class="fas fa-arrow-circle-up f-4 float-right green"></i>
                        </Card.Body>
                    </Card>
                    <Card className="col-3">
                        <Card.Body>
                            <Card.Title></Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                    </Card.Text>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>

                </Row>
            </React.Fragment>
        )
    }
}
