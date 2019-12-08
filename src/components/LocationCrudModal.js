import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import httpServiceLayer from '../services/http-service-layer';
import { API } from '../config/config';

export default class LocationCrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleLocationNameChange = this.handleLocationNameChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.addOrUpdateLocation = this.addOrUpdateLocation.bind(this);
        this.deleteLocation = this.deleteLocation.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            modal: false,
            deleteModal: false,
            location_name: undefined,
            address: undefined,
            id: undefined
        };
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.handleShow();
    }

    addOrUpdateLocation() {
        let input = {};
        input['location_name'] = this.state.location_name;
        input['address'] = this.state.address;
        if (!input['location_name']) {
            return;
        }
        let URL = API.ADD_LOCATION;
        if (this.props.modalData['action'] === 'edit') {
            URL = API.UPDATE_LOCATION;
            input['location_id'] = this.state.id;
        }
        try {
            this.services.commonHttpPostService(URL, input).then((response) => {
                if (response && response.data) {
                    this.handleClose();
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    deleteLocation() {
        let input = {};
        input['location_id'] = this.state.id;
        try {
            this.services.commonHttpPostService(API.DELETE_LOCATION, input).then((response) => {
                if (response && response.data) {
                    this.handleClose();
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }

    handleAddressChange = e => {
        this.setState({
            address: e.target.value
        })
    }

    handleLocationNameChange = e => {
        this.setState({
            location_name: e.target.value
        })
    }

    handleClose() {
        this.setState({
            addModalShow: false,
            deleteModal: false,
            location_name: undefined,
            address: undefined,
            id: undefined
        });
        this.props.emitData();
    }

    handleShow() {
        if (this.props.modalData['action'] === 'edit') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                location_name: this.props.modalData['data']['location_name'],
                address: this.props.modalData['data']['address'],
                id: this.props.modalData['data']['location_id']
            });
        } else if (this.props.modalData['action'] === 'add') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                location_name: undefined,
                address: undefined,
                id: undefined
            });
        } else {
            this.setState({
                addModalShow: false,
                deleteModal: true,
                location_name: this.props.modalData['data']['location_name'],
                address: this.props.modalData['data']['address'],
                id: this.props.modalData['data']['location_id']
            });
        }
        console.log(this.props);
    }
    render() {
        return (
            <React.Fragment>
                <Modal show={this.state.addModalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalData['title']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.location_name} onChange={this.handleLocationNameChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.address} onChange={this.handleAddressChange}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.addOrUpdateLocation}>
                            {this.props.modalData['action'] === 'edit' ? <span>Save Changes</span> : <span>Add</span>
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.deleteModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalData['title']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete <b>{this.state.location_name}</b> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteLocation}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
