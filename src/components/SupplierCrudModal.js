import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default class SupplierCrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            modal: false,
            deleteModal: false,
            supplier: undefined,
            contact: undefined,
            id: undefined
        };
    }
    componentDidMount() {
        this.handleShow();
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
                id: this.props.modalData['data']['id']
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
                id: this.props.modalData['data']['id']
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
                                <Form.Control type="text" placeholder="Enter supplier name" value={this.state.supplier} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address/Contact</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={this.state.contact} />
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
                        Are You sure to delete <b>{this.state.supplier}</b> ?
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
