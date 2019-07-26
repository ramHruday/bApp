import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import httpServiceLayer from '../services/http-service-layer';
import InputRange from 'react-input-range';


export default class InventoryCrudModal extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.kpiForNow = 100;
        this.state = {
            modal: false,
            deleteModal: false,
            selectedItem: {
                selectedProduct: null,
                selectedSupplier: null,
                selectedLocation: null,
                productCode: undefined,
                selectedBrand: null,
                quantity: undefined,
                mrp: null,
                kpi: {
                    min: 0,
                    max: 50
                },
                id: null
            },
            products: [],
            suppliers: [],
            locations: [],
            brands: []
        };
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.handleShow();
    }
    getInventoryItemById() {
        const storedItem = this.services.jsonFetch('getInventoryItem')['data'];
        let objItem = {
            selectedProduct: {
                value: storedItem['product_id'],
                label: storedItem['product_name'] + ' → ' + storedItem['sub_type'],
            },
            selectedSupplier: {
                value: storedItem['supplier_id'],
                label: storedItem['supplier_name'],
            },
            selectedLocation: {
                value: storedItem['location_id'],
                label: storedItem['location_name'],
            },
            productCode: storedItem['sub_details'],
            selectedBrand: {
                value: storedItem['brand_id'],
                label: storedItem['brand_series'] + '-' + storedItem['brand_name'],
            },
            quantity: storedItem['quantity'],
            kpi: storedItem['kpi'],
            mrp: storedItem['mrp'],
            id: storedItem['id'],
        }
        this.kpiForNow = storedItem['kpi'].max;
        this.setState({ selectedItem: objItem });
    }
    handleClose() {
        this.setState({
            addModalShow: false,
            deleteModal: false,
            selectedProduct: null,
            selectedSupplier: null,
        });
        this.kpiForNow = 100;
        this.props.emitData();
    }
    handleChangeProductSelect = selectedProduct => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.selectedProduct = selectedProduct;
        this.setState({
            selectedItem: newSelected
        });

    };
    handleChangeSupplierSelect = selectedSupplier => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.selectedSupplier = selectedSupplier;
        this.setState({
            selectedItem: newSelected
        });
    };
    handleChangeLocationSelect = selectedLocation => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.selectedLocation = selectedLocation;
        this.setState({
            selectedItem: newSelected
        });
    };
    handleChangeBrandSelect = selectedBrand => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.selectedBrand = selectedBrand;
        this.setState({
            selectedItem: newSelected
        });
    };
    handleChangeMrp = mrp => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.mrp = mrp;
        this.setState({
            selectedItem: newSelected
        });
    }
    handleChangeQuantity = quantity => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.quantity = quantity;
        this.setState({
            selectedItem: newSelected
        });
    }
    handleKPIChange = kpi => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.kpi = kpi;
        this.setState({
            selectedItem: newSelected
        });
    }
    handleMinKpi = min => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.kpi.min = min.target.value;
        this.setState({
            selectedItem: newSelected
        });
    }
    handleMaxKpi = max => {
        var newSelected = Object.assign({}, this.state.selectedItem);
        newSelected.kpi.max = max.target.value;
        this.setState({
            selectedItem: newSelected
        });
    }
    handleShow() {
        if (this.props.modalData['action'] === 'edit') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                products: this.props.modalData['products'],
                suppliers: this.props.modalData['suppliers'],
                locations: this.props.modalData['locations'],
                brands: this.props.modalData['brands'],
            });
            this.getInventoryItemById();
        } else if (this.props.modalData['action'] === 'add') {
            this.setState({
                addModalShow: true,
                deleteModal: false,
                products: this.props.modalData['products'],
                suppliers: this.props.modalData['suppliers'],
                locations: this.props.modalData['locations'],
                brands: this.props.modalData['brands']
            });
        } else {
            this.setState({
                addModalShow: false,
                deleteModal: true,
            });
            this.getInventoryItemById();
        }
        console.log(this.props);
    }
    render() {
        return (
            <React.Fragment>
                <Modal show={this.state.addModalShow} onHide={this.handleClose} className="inventory-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalData['title']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* {this.props.modalData['action'] === 'edit' &&
                                <Form.Group as={Row}>
                                    <Form.Label column sm="4">Inventory ID</Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text" readOnly defaultValue={this.state.selectedItem.id} />
                                    </Col>
                                </Form.Group>
                            } */}
                            <Form.Group as={Row} className="pb-3" >
                                <Form.Label column sm="4">Product Name</Form.Label>
                                <Col sm="8">
                                    <Select
                                        value={this.state.selectedItem.selectedProduct}
                                        onChange={this.handleChangeProductSelect}
                                        options={this.state.products}
                                        isDisabled={this.props.modalData['action'] === 'add' ? false : true}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="pb-3">
                                <Form.Label column sm="4">Supplier Name</Form.Label>
                                <Col sm="8">
                                    <Select
                                        value={this.state.selectedItem.selectedSupplier}
                                        onChange={this.handleChangeSupplierSelect}
                                        options={this.state.suppliers}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="pb-3">
                                <Form.Label column sm="4">Location</Form.Label>
                                <Col sm="8">
                                    <Select
                                        value={this.state.selectedItem.selectedLocation}
                                        onChange={this.handleChangeLocationSelect}
                                        options={this.state.locations}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="pb-3">
                                <Form.Label column sm="4">Brand</Form.Label>
                                <Col sm="8">
                                    <Select
                                        value={this.state.selectedItem.selectedBrand}
                                        onChange={this.handleChangeBrandSelect}
                                        options={this.state.brands}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="pb-3">
                                <Form.Label column sm="2">MRP</Form.Label>
                                <Col sm="4">
                                    <Form.Control type="number" min="0" defaultValue={this.state.selectedItem.mrp} onChange={this.handleChangeMrp.bind(this)} />
                                </Col>
                                <Form.Label column sm="2">Quantity</Form.Label>
                                <Col sm="4">
                                    <Form.Control type="number" min="0" defaultValue={this.state.selectedItem.quantity} onChange={this.handleChangeQuantity.bind(this)} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="p-3">
                                <Form.Label column sm="2">KPI</Form.Label>
                                <Col sm="10" className="p-2">
                                    <InputRange
                                        maxValue={Number(this.kpiForNow) * 4}
                                        minValue={0}
                                        formatLabel={value => `${value}`}
                                        value={this.state.selectedItem.kpi}
                                        onChange={this.handleKPIChange} />
                                </Col>
                                    <Form.Label column sm="2"></Form.Label>
                                    <Col sm="4">
                                        <Form.Control type="number" min="0" value={this.state.selectedItem.kpi.min} placeholder="KPI min value" onChange={this.handleMinKpi.bind(this)} />
                                    </Col>
                                    <Form.Label column sm="2"></Form.Label>
                                    <Col sm="4">
                                        <Form.Control type="number" min="0" value={this.state.selectedItem.kpi.max} placeholder="KPI max value" onChange={this.handleMaxKpi.bind(this)} />
                                    </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.deleteModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalData['title']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete <b>{this.state.selectedItem.id}</b> ?
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
