import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import httpServiceLayer from '../services/http-service-layer';
import { API } from '../config/config';

export default class CrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.addOrUpdateProduct = this.addOrUpdateProduct.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleAddEditKeyPress = this.handleAddEditKeyPress.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubTypeChange = this.handleSubTypeChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            modal: false,
            deleteModal: false,
            productName: undefined,
            subType: undefined,
            product_id: undefined
        };
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.handleShow();
    }
    handleClose() {
        this.setState({
            addModalShow: false,
            deleteModal: false,
            productName: undefined,
            subType: undefined,
            product_id: undefined
        });
        this.props.emitData();
    }

    handleShow() {
        if (this.props.modalData['action'] === 'edit') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                productName: this.props.modalData['data']['name'],
                subType: this.props.modalData['data']['subType'],
                product_id: this.props.modalData['data']['product_id']
            });
        } else if (this.props.modalData['action'] === 'add') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                productName: undefined,
                subType: undefined,
                product_id: undefined
            });
        } else {
            this.setState({
                addModalShow: false,
                deleteModal: true,
                productName: this.props.modalData['data']['name'],
                subType: this.props.modalData['data']['subType'],
                product_id: this.props.modalData['data']['product_id']
            });
        }
        console.log(this.props);
    }
    addOrUpdateProduct() {
        let input = {};
        input['name'] = this.state.productName;
        input['subType'] = this.state.subType;
        if(!input['name']){
            return;
        }
        let URL = 'ADD_PRODUCT'
        if (this.props.modalData['action'] === 'edit') {
            URL = 'UPDATE_PRODUCT';
            input['product_id'] = this.state.product_id;
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

        }
    }
    deleteProduct() {
        let input = {};
        input['product_id'] = this.state.product_id;
        try {
            this.services.commonHttpPostService(API.DELETE_PRODUCT, input).then((response) => {
                if (response && response.data) {
                    this.handleClose();
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }
    handleKeyPress(target) {
        if (target.charCode === 13) {
            this.deleteProduct();
        }
    }
    handleAddEditKeyPress(target) {
        if (target.charCode === 13) {
            this.addOrUpdateProduct();
        }
    }
    handleSubTypeChange = e => {
        this.setState({
            subType: e.target.value
        })
    }
    handleProductChange = e => {
        this.setState({
            productName: e.target.value
        })
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
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Product Name" value={this.state.productName} onChange={this.handleProductChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Sub type</Form.Label>
                                <Form.Control type="text" placeholder="Enter Sub Type" value={this.state.subType} onChange={this.handleSubTypeChange} onKeyPress={this.handleAddEditKeyPress}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" onClick={this.addOrUpdateProduct}  >
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
                        Are You sure to delete <b>{this.state.productName}</b> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" onClick={this.deleteProduct} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
