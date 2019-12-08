import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import jsPDF from 'jspdf';
import LocationCrudModal from './LocationCrudModal';
import { API } from '../config/config';


export default class Location extends Component {
    constructor(props) {
        super(props);
        // this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            locationRows: [],
            CrudModalShow: false,
            modalPassData: {

            }
        };
        this.columns = [

            {
                "accessor": "location_name",
                "filterable": true,
                "Header": "Name"
            },
            {
                "accessor": "address",
                "filterable": true,
                "Header": "Address"
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
        this.doc = new jsPDF();
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.getLocations();
    }
    getLocations() {
        this.services.commonHttpGetService(API.GET_LOCATIONS).then((response) => {
            if (response && response.data) {
                this.setState({
                    locationRows: response.data.result
                })
            } else {
                console.log('error', response)
            }
        })
    }
    openModal(action, data) {
        let obj = {};
        if (action === 'edit') {
            obj['title'] = 'Edit Location';
        } else if (action === 'add') {
            obj['title'] = 'Add Location';
        } else {
            obj['title'] = 'Delete Location';
        }
        obj['action'] = action;
        obj['data'] = data;
        this.setState({
            CrudModalShow: true,
            modalPassData: obj
        })
    }
    handleClose() {
        this.getLocations();
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
        for (let i = 0; i < this.state.locationRows.length; i++) {
            bodyContent[i] = [];
            for (let j = 0; j < this.columns.length; j++) {
                const bodyData = this.state.locationRows[i];
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
        const name = 'Locations-' + new Date().toLocaleDateString() +'.pdf';
        this.doc.setProperties({
            title: 'Locations',
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
                    data={this.state.locationRows}
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
                    <button className="btn btn-sm action m-auto" title="Download PDF" onClick={() => this.downloadFile()}><i className="fas fa-file-download"></i></button>
                </div>
                <Row>
                    <Col md="12" lg="12" sm="12" className="p-0">
                        {
                            this.state && this.state.locationRows  &&
                            <div> {tabularDataConst()} </div >
                        }
                    </Col>
                </Row>
                {
                    this.state && this.state.CrudModalShow &&
                    <LocationCrudModal modalData={this.state.modalPassData} emitData={this.handleClose} />
                }
            </Container>
        )
    }
}
