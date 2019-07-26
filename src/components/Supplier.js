import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import jsPDF from 'jspdf';
import SupplierCrudModal from './SupplierCrudModal';


export default class Supplier extends Component {
    constructor(props) {
        super(props);
        // this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            supplierRows: [],
            CrudModalShow: false,
            modalPassData: {

            }

        };
        this.columns = [
            {
                "accessor": "supplier",
                "Header": "Supplier Name",
                "filterable": true,
            },
            {
                "accessor": "contact",
                "Header": "Address/Contact",
                "filterable": true,
            },
            {
                "accessor": "action",
                "filterable": false,
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
        this.getSuppliers();
    }
    getSuppliers() {
        this.setState({
            supplierRows: this.services.jsonFetch('suppliers')['data']['rows']
        })
    }
    openModal(action, data) {
        let obj = {};
        if (action === 'edit') {
            obj['title'] = 'Edit Supplier';
        } else if (action === 'add') {
            obj['title'] = 'Add Supplier';
        } else {
            obj['title'] = 'Delete Supplier';
        }
        obj['action'] = action;
        obj['data'] = data;
        this.setState({
            CrudModalShow: true,
            modalPassData: obj
        })
    }
    handleClose() {
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
        for (let i = 0; i < this.state.supplierRows.length; i++) {
            bodyContent[i] = [];
            for (let j = 0; j < this.columns.length; j++) {
                const bodyData = this.state.supplierRows[i];
                if (this.columns[j].accessor && this.columns[j].accessor !== 'action') {
                    if (!Array.isArray(bodyData[this.columns[j].accessor]) && typeof bodyData[this.columns[j].accessor] !== 'object') {
                        bodyContent[i].push(bodyData[this.columns[j].accessor]);
                    } else if (typeof bodyData[this.columns[j].accessor] === 'object') {
                        bodyContent[i].push(this.convertObjectValuesToArray(bodyData[this.columns[j].accessor]).join(','));
                    }else if(Array.isArray(bodyData[this.columns[j].accessor])){
                        bodyContent[i].push(bodyData[this.columns[j].accessor].join(','));                        
                    }
                }
            }
        }
        this.doc.autoTable({
            styles: {minCellWidth: 20},
            headStyles:{},
            margin: {top: 10},
            head: [headerContent],
            body: bodyContent
        });
        const name = 'Suppliers-' + new Date().toLocaleDateString() +'.pdf';
        this.doc.setProperties({
            title: 'Suppliers',
            author: 'user',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'bApp'
        });
        this.doc.save(name);
    }
    render() {
        const tabularDataConst = () => {
            return (
                <ReactTable
                    data={this.state.supplierRows}
                    columns={this.columns}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    defaultPageSize={11}
                    showFilters={true}
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toLowerCase().includes(filter.value.toLowerCase()) }}
                />
            );
        }
        return (
            <Container>
                <div className="row bg-dark">
                    <button className="btn btn-sm action m-auto" title="Edit" onClick={() => this.openModal('add', {})}><i className="fas fa-plus"></i></button>
                    <button className="btn btn-sm action m-auto" title="Download PDF" onClick={() => this.downloadFile()} ><i className="fas fa-file-download"></i></button>
                </div>
                <Row>
                    <Col md="12" lg="12" sm="12" className="p-0">
                        {
                            this.state && this.state.supplierRows && this.state.supplierRows.length &&
                            <div> {tabularDataConst()} </div >
                        }
                    </Col>
                </Row>
                {
                    this.state && this.state.CrudModalShow &&
                    <SupplierCrudModal modalData={this.state.modalPassData} emitData={this.handleClose} />
                }
            </Container>
        )
    }
}
