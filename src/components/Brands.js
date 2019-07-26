import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import jsPDF from 'jspdf';
import BrandsCrudModal from './BrandsCrudModal';


export default class Brands extends Component {
    constructor(props) {
        super(props);
        // this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            brandRows: [],
            CrudModalShow: false,
            modalPassData: {

            }
        };
        this.columns = [

            {
                "accessor": "brand_series",
                "filterable": true,
                "Header": "Brand series/Sub-Brand"
            },
            {
                "accessor": "brand_name",
                "filterable": true,
                "Header": "Brand"
            },            
            {
                "accessor": "brand_rep",
                "filterable": true,
                "Header": "Brand Rep"
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
        this.getProducts();
    }
    getProducts() {
        this.setState({
            brandRows: this.services.jsonFetch('getBrands')['data']['rows']
        })
    }
    openModal(action, data) {
        let obj = {};
        if (action === 'edit') {
            obj['title'] = 'Edit Brand';
        } else if (action === 'add') {
            obj['title'] = 'Add Brand';
        } else {
            obj['title'] = 'Delete Brand';
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
        for (let i = 0; i < this.state.brandRows.length; i++) {
            bodyContent[i] = [];
            for (let j = 0; j < this.columns.length; j++) {
                const bodyData = this.state.brandRows[i];
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
        const name = 'Brands-' + new Date().toLocaleDateString() +'.pdf';
        this.doc.setProperties({
            title: 'Brands',
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
                    data={this.state.brandRows}
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
                    <button className="btn btn-sm action m-auto" title="Download PDF" onClick={() => this.downloadFile()} ><i className="fas fa-file-download"></i></button>
                </div>
                <Row>
                    <Col md="12" lg="12" sm="12" className="p-0">
                        {
                            this.state && this.state.brandRows && this.state.brandRows.length &&
                            <div> {tabularDataConst()} </div >
                        }
                    </Col>
                </Row>
                {
                    this.state && this.state.CrudModalShow &&
                    <BrandsCrudModal modalData={this.state.modalPassData} emitData={this.handleClose} />
                }
            </Container>
        )
    }
}
