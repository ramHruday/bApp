import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { API } from '../config/config';
import httpServiceLayer from '../services/http-service-layer';


export default class SupplierCrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleSupplierChange = this.handleSupplierChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addOrUpdateSupplier = this.addOrUpdateSupplier.bind(this);
        this.deleteSupplier = this.deleteSupplier.bind(this);
        this.state = {
            modal: false,
            deleteModal: false,
            supplier: undefined,
            contact: undefined,
            id: undefined
        };
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.handleShow();
    }

    addOrUpdateSupplier() {
        let input = {};
        input['supplier'] = this.state.supplier;
        input['contact'] = this.state.contact;
        if (!input['supplier']) {
            return;
        }
        let URL = 'ADD_SUPPLIER';
        if (this.props.modalData['action'] === 'edit') {
            URL = 'UPDATE_SUPPLIER';
            input['supplier_id'] = this.state.id;
        }
        try {
            this.services.commonHttpPostService(API[URL], input).then((response) => {
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
    deleteSupplier() {
        let input = {};
        input['supplier_id'] = this.state.id;
        try {
            this.services.commonHttpPostService(API.DELETE_SUPPLIER, input).then((response) => {
                if (response && response.data) {
                    this.handleClose();
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }

    handleSupplierChange = e => {
        this.setState({
            supplier: e.target.value
        })
    }

    handleContactChange = e => {
        this.setState({
            contact: e.target.value
        })
    }

    handleClose() {
        this.setState({
            addModalShow: false,
            deleteModal: false,
            supplier: undefined,
            contact: undefined,
            id: undefined
        });
        this.props.emitData();
    }

    handleShow() {
        if (this.props.modalData['action'] === 'edit') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                supplier: this.props.modalData['data']['supplier'],
                contact: this.props.modalData['data']['contact'],
                id: this.props.modalData['data']['supplier_id']
            });
        } else if (this.props.modalData['action'] === 'add') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                supplier: undefined,
                contact: undefined,
                id: undefined
            });
        } else {
            this.setState({
                addModalShow: false,
                deleteModal: true,
                supplier: this.props.modalData['data']['supplier'],
                contact: this.props.modalData['data']['contact'],
                id: this.props.modalData['data']['supplier_id']
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
                                <Form.Label>Supplier</Form.Label>
                                <Form.Control type="text" placeholder="Enter supplier name" value={this.state.supplier} onChange={this.handleSupplierChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address/Contact</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.contact} onChange={this.handleContactChange}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.addOrUpdateSupplier}>
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
                        Are You sure to delete <b>{this.state.supplier}</b> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteSupplier}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
