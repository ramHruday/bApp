import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';
import InventoryCrudModal from './InventoryCrudModal';
import { API } from '../config/config';
import jsPDF from 'jspdf';

export default class Inventory extends Component {
    constructor(props) {
        super(props);
        // this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            tableData: {
                rows: [
                ]
            },
            CrudModalShow: false,
            modalPassData: {

            },
            products: [],
            suppliers: [],
            locations: [],
            brands: []
        };
        this.columns = [
            {
                "accessor": "product_name",
                "filterable": true,
                "Header": "Name"
            },
            {
                "filterable": true,
                "accessor": "sub_type",
                "Header": "Sub type"
            },
            {
                "filterable": true,
                "accessor": "supplier_name",
                "Header": "Supplier"
            },
            {
                "filterable": true,
                "accessor": "location_name",
                "Header": "Location"
            },
            {
                "filterable": true,
                "accessor": "last_updated",
                "Header": "Last Updated"
            },
            {
                "filterable": true,
                "accessor": "sub_details",
                "Header": "Id/Product Code"
            },
            {
                "filterable": true,
                "accessor": "brand",
                "Header": "Brand"
            },
            {
                "filterable": true,
                "accessor": "quantity",
                "Header": "Qty"
            },
            {
                "filterable": true,
                "accessor": "mrp",
                "Header": "MRP"
            },
            {
                "filterable": true,
                "accessor": "kpi",
                "Header": "KPI",
                Cell: data => {
                    let output = [];
                    output = [data.value.min, data.value.max];
                    return output.join(' => ');
                },
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
        this.getInventory();
        this.getProducts();
        this.getSuppliers();
        this.getLocations();
        this.getBrands();
    }
    getInventory() {
        this.setState({ tableData: this.services.jsonFetch('inventory')['data']['rows'] });
    }
    getProducts() {
        try {
            this.services.commonHttpGetService(API.GET_PRODUCTS).then((response) => {
                if (response && response.data) {
                    this.formatProductsForSelect(response.data.result);
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }

    }
    getSuppliers() {
        try {
            this.services.commonHttpGetService(API.GET_SUPPLIERS).then((response) => {
                if (response && response.data) {
                    this.formatSuppliersForSelect(response.data.result);
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }

    }
    getLocations() {
        try {
            this.services.commonHttpGetService(API.GET_LOCATIONS).then((response) => {
                if (response && response.data) {
                    this.formatLocationsForSelect(response.data.result);
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }
    getBrands() {
        try {
            this.services.commonHttpGetService(API.GET_BRANDS).then((response) => {
                if (response && response.data) {
                    this.formatBrandsForSelect(response.data.result);
                } else {
                    console.log('error', response)
                }
            })
        } catch (error) {

        }
    }

    formatProductsForSelect(products) {
        let temporaryProducts = [];
        const productsList = products
        for (let i = 0; i < productsList.length; i++) {
            const product = productsList[i];
            let obj = {};
            obj['value'] = product['product_id'];
            obj['label'] = product['name'] + ' → ' + product['subType'];
            // obj['sub_type'] = product['sub_type'];
            temporaryProducts.push(obj);
        }
        this.setState({ products: temporaryProducts });
    }

    formatLocationsForSelect(locationList) {
        let temporaryLocations = [];
        for (let i = 0; i < locationList.length; i++) {
            const product = locationList[i];
            let obj = {};
            obj['value'] = product['id'];
            obj['label'] = product['location_name'];
            temporaryLocations.push(obj);
        }
        this.setState({ locations: temporaryLocations });
    }

    formatSuppliersForSelect(suppliers) {
        let temporarySuppliers = [];
        for (let i = 0; i < suppliers.length; i++) {
            const product = suppliers[i];
            let obj = {};
            obj['value'] = product['id'];
            obj['label'] = product['supplier'];
            temporarySuppliers.push(obj);
        }
        this.setState({ suppliers: temporarySuppliers });

    }
    formatBrandsForSelect(brands) {
        let temporaryBrands = [];
        for (let i = 0; i < brands.length; i++) {
            const brand = brands[i];
            let obj = {};
            obj['value'] = brand['brand_id'];
            obj['label'] = brand['brand_series'] + '-' + brand['brand_name'];
            temporaryBrands.push(obj);
        }
        this.setState({ brands: temporaryBrands });

    }
    handleClose() {
        this.setState({
            CrudModalShow: false,
            modalPassData: {}
        })
    }
    // handleShow() {
    //     this.setState({ addModalShow: true });
    // }
    openModal(action, data) {
        let obj = {};
        if (action === 'edit') {
            obj['title'] = 'Edit Inventory item';
        } else if (action === 'add') {
            obj['title'] = 'Add item in Inventory';
        } else {
            obj['title'] = 'Delete Item';
        }
        obj['action'] = action;
        obj['data'] = data;
        obj['products'] = this.state.products;
        obj['suppliers'] = this.state.suppliers;
        obj['brands'] = this.state.brands;
        obj['locations'] = this.state.locations;
        this.setState({
            CrudModalShow: true,
            modalPassData: obj
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
        for (let i = 0; i < this.state.tableData.length; i++) {
            bodyContent[i] = [];
            for (let j = 0; j < this.columns.length; j++) {
                const bodyData = this.state.tableData[i];
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
        const name = 'Inventory-' + new Date().toLocaleDateString() +'.pdf';
        this.doc.setProperties({
            title: 'Inventory',
            author: 'user',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'bApp'
        });
        this.doc.save(name);
    }
    convertObjectValuesToArray(obj) {
        let array = [];
        var keys = Object.keys(obj);
        keys.forEach(function (key) {
            var value = obj[key]
                array.push(value)
        })
        return array;
    }
    render() {
        const tabularDataConst = () => {
            return (
                <ReactTable
                    data={this.state.tableData}
                    columns={this.columns}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    defaultPageSize={11}
                    showFilters={true}
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase()) }}
                />
            );
        }
        return (
            <div>
                <h3 className="pt-4 d-inline-block">Inventory items</h3>
                <div className="pt-4 pr-2 d-inline-block float-right">
                    <button className="btn btn-sm action panel-button p-1 mr-2" title="Add Item" onClick={() => this.openModal('add', {})}><i className="fas fa-plus"></i></button>
                    <button className="btn btn-sm action panel-button p-1" title="Download PDF" onClick={() => this.downloadFile()}><i className="fas fa-file-download"></i></button>
                </div>
                {
                    this.state && this.state.tableData && this.state.tableData.length &&
                    <div> {tabularDataConst()} </div >
                }
                {
                    this.state && this.state.CrudModalShow &&
                    <InventoryCrudModal modalData={this.state.modalPassData} emitData={this.handleClose} />
                }
            </div>
        )
    }
}
