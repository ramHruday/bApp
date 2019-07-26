import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default class BrandsCrudModal extends Component {
    constructor(props) {
        super(props);
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
    }
    componentDidMount() {
        this.handleShow();
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
                location_name: undefined,
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
                                <Form.Control type="text" placeholder="Enter name" value={this.state.brand_series} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={this.state.brand_name} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Brand Representative</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.brand_rep} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.brand_contact} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
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
                        Are You sure to delete <b>{this.state.brand_id}</b> ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
