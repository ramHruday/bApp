import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CrudModal from './CrudModal';
import { API } from '../config/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default class Product extends Component {
    constructor(props) {
        super(props);
        // this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openModal = this.openModal.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.state = {
            productsRows: [],
            CrudModalShow: false,
            modalPassData: {

            }
        };
        this.columns = [
            {
                "accessor": "name",
                "filterable": true,
                "Header": "Name"
            },
            {
                "accessor": "subType",
                "filterable": true,
                "Header": "Sub type"
            },
            {
                "accessor": "action",
                Header: () => (
                    <span>
                        Action
                </span>
                ),
                Cell: row => (
                    <div>
                        <button className="btn btn-sm action" title="Edit" onClick={() => this.openModal('edit', row['original'])}><i className="fas fa-pen"></i></button>
                        <button className="btn btn-sm action" title="Delete" onClick={() => this.openModal('delete', row['original'])}><i className="fas fa-trash"></i></button>
                    </div>
                )
            }
        ]
        this.services = new httpServiceLayer();
        this.doc = new jsPDF();
    }
    componentDidMount() {
        this.getProducts();
    }
    getProducts() {
        try {
            this.services.commonHttpGetService(API.GET_PRODUCTS).then((response) => {
                if (response && response.data) {
                    this.setState({
                        productsRows: response.data.result
                    })
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }

    }
    openModal(action, data) {
        let obj = {};
        if (action === 'edit') {
            obj['title'] = 'Edit Product';
        } else if (action === 'add') {
            obj['title'] = 'Add Product';
        } else {
            obj['title'] = 'Delete Product';
        }
        obj['action'] = action;
        obj['data'] = data;
        this.setState({
            CrudModalShow: true,
            modalPassData: obj
        })
    }

    handleClose() {
        this.getProducts();
        this.setState({
            CrudModalShow: false,
            modalPassData: {}
        })
    }
    downloadFile() {
        let headerContent = [], bodyContent = [];
        for (let i = 0; i < this.columns.length; i++) {
            const headerData = this.columns[i];
            if (headerData.accessor && headerData.accessor !== 'action') {
                headerContent.push(headerData.Header);
            }
        }
        for (let i = 0; i < this.state.productsRows.length; i++) {
            bodyContent[i] = [];
            for (let j = 0; j < this.columns.length; j++) {
                const bodyData = this.state.productsRows[i];
                if (this.columns[j].accessor && this.columns[j].accessor !== 'action') {
                    bodyContent[i].push(bodyData[this.columns[j].accessor]);
                }
            }
        }
        this.doc.autoTable({
            head: [headerContent],
            body: bodyContent
        });
        const name = 'Products_' + new Date().toLocaleDateString() +'.pdf';
        this.doc.save(name);
    }
    render() {
        const tabularDataConst = () => {
            return (
                <ReactTable
                    data={this.state.productsRows}
                    columns={this.columns}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    defaultPageSize={11}
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) }}
                />
            );
        }
        return (
            <Container>
                <div className="row bg-dark">
                    <button className="btn btn-sm action m-auto" title="Edit" onClick={() => this.openModal('add', {})}><i className="fas fa-plus"></i></button>
                    <button className="btn btn-sm action m-auto" title="Download" onClick={() => this.downloadFile()}><i className="fas fa-file-download"></i></button>
                </div>
                <Row>
                    <Col md="12" lg="12" sm="12" className="p-0">
                        {
                            this.state && this.state.productsRows && this.state.productsRows.length > 0 &&
                            <div> {tabularDataConst()} </div >
                        }{
                            this.state && this.state.productsRows && this.state.productsRows.length <= 0 &&
                            <div className="skeleton tab-50">

                            </div>
                        }
                    </Col>
                </Row>
                {
                    this.state && this.state.CrudModalShow &&
                    <CrudModal modalData={this.state.modalPassData} emitData={this.handleClose} />
                }
            </Container>
        )
    }
}
