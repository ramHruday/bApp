import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { API } from '../config/config';
import httpServiceLayer from '../services/http-service-layer';


export default class BrandsCrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleBrandSeriesChange = this.handleBrandSeriesChange.bind(this);
        this.handleBrandNameChange = this.handleBrandNameChange.bind(this);
        this.handleBrandRepChange = this.handleBrandRepChange.bind(this);
        this.handleBrandContactChange = this.handleBrandContactChange.bind(this);
        this.addOrUpdateBrand = this.addOrUpdateBrand.bind(this);
        this.deleteBrand = this.deleteBrand.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            modal: false,
            deleteModal: false,
            brand_series: undefined,
            brand_rep: undefined,
            brand_contact: undefined,
            brand_name: undefined,
            brand_id: undefined,
        };
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.handleShow();
    }

    handleBrandNameChange = e => {
        this.setState({
            brand_name: e.target.value
        })
    }

    handleBrandRepChange = e => {
        this.setState({
            brand_rep: e.target.value
        })
    }

    handleBrandSeriesChange = e => {
        this.setState({
            brand_series: e.target.value
        })
    }

    handleBrandContactChange = e => {
        this.setState({
            brand_contact: e.target.value
        })
    }


    addOrUpdateBrand() {
        let input = {};
        input['brand_series'] = this.state.brand_series;
        input['brand_name'] = this.state.brand_name;
        input['brand_rep'] = this.state.brand_rep;
        input['brand_contact'] = this.state.brand_contact;
        if (!input['brand_series']) {
            return;
        }
        let URL = API.ADD_BRAND;
        if (this.props.modalData['action'] === 'edit') {
            URL = API.UPDATE_BRAND;
            input['brand_id'] = this.state.brand_id;
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
    deleteBrand() {
        let input = {};
        input['brand_id'] = this.state.brand_id;
        try {
            this.services.commonHttpPostService(API.DELETE_BRAND, input).then((response) => {
                if (response && response.data) {
                    this.handleClose();
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }

    handleClose() {
        this.setState({
            addModalShow: false,
            deleteModal: false,
            brand_series: undefined,
            brand_rep: undefined,
            brand_contact: undefined,
            brand_name: undefined,
            brand_id: undefined,
        });
        this.props.emitData();
    }

    handleShow() {
        if (this.props.modalData['action'] === 'edit') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                brand_series: this.props.modalData['data']['brand_series'],
                brand_rep: this.props.modalData['data']['brand_rep'],
                brand_contact: this.props.modalData['data']['brand_contact'],
                brand_name: this.props.modalData['data']['brand_name'],
                brand_id: this.props.modalData['data']['brand_id'],
            });
        } else if (this.props.modalData['action'] === 'add') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                brand_series: undefined,
                address: undefined,
                id: undefined
            });
        } else {
            this.setState({
                addModalShow: false,
                deleteModal: true,
                brand_series: this.props.modalData['data']['brand_series'],
                brand_rep: this.props.modalData['data']['brand_rep'],
                brand_contact: this.props.modalData['data']['brand_contact'],
                brand_name: this.props.modalData['data']['brand_name'],
                brand_id: this.props.modalData['data']['brand_id']
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
                                <Form.Label>Brand Series/ Sub product name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.brand_series} onChange={this.handleBrandSeriesChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.brand_name} onChange={this.handleBrandNameChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Brand Representative</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.brand_rep} onChange={this.handleBrandRepChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.brand_contact} onChange={this.handleBrandContactChange}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.addOrUpdateBrand}>
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
                        Are You sure to delete <b>{this.state.brand_name}</b> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteBrand}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
