import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';
import Select from 'react-select';
// import Form from 'react-bootstrap/Form';


export default class BillingPanel extends Component {
    constructor(props) {
        super(props);
        this.renderInventoryProductEditable = this.renderInventoryProductEditable.bind(this);
        this.handleChangeBrand = this.handleChangeBrand.bind(this);
        this.renderMrpEditable = this.renderMrpEditable.bind(this);
        this.renderDiscountEditable = this.renderDiscountEditable.bind(this);
        this.renderBrandEditable = this.renderBrandEditable.bind(this);
        this.renderQuantityEditable = this.renderQuantityEditable.bind(this);
        this.handleChangeItemSelect = this.handleChangeItemSelect.bind(this);
        this.state = {
            theBill: [],
            inventory: [],
            selectedItemInvetory: {
                value: 'Switch_2-way_Legrand',
                label: "Switch_2-way_Legrand"
            },
        };
        this.columns = [
            {
                "accessor": "name",
                "filterable": true,
                "Header": "Name",
                Cell: this.renderInventoryProductEditable
            },
            {
                "filterable": true,
                "accessor": "brand",
                "Header": "Brand",
                Cell: this.renderBrandEditable

            },
            {
                "filterable": true,
                "accessor": "mrp",
                "Header": "MRP",
                Cell: this.renderMrpEditable
            },
            {
                "filterable": true,
                "accessor": "quantity",
                "Header": "Quantity",
                Cell: this.renderQuantityEditable,
                Footer: () => (
                    <span>
                        <strong>Count</strong>
                    </span>
                )
            },
            {
                "filterable": true,
                "accessor": "discount",
                "Header": "Discount %",
                Cell: this.renderDiscountEditable,
                Footer: () => (
                    <span>
                        <strong>Avg</strong>
                    </span>
                )
            },
            {
                "filterable": true,
                "accessor": "amount",
                "Header": "Amount",
                Cell: this.renderAmountEditable,
                Footer: () => (
                    <span>
                        <strong>Total</strong>
                    </span>
                )
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
                        {this.state.theBill.length - 1 === row.index &&
                            <button className="btn btn-sm action" title="Add" onClick={() => this.addRowInBill(row)}><i class="fas fa-plus"></i></button>}
                        <button className="btn btn-sm action" title="Clear" onClick={() => this.clearUp(row)}><i class="fas fa-times-circle"></i></button>                        
                        {this.state.theBill.length !== 1 &&
                            <button className="btn btn-sm action" title="Add" onClick={() => this.deleteRowInBill(row)}><i class="far fa-trash-alt"></i></button>}
                    </div>
                ),
                width: 100,
            }
        ]
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.getInventoryForSelect();
        // const { handle } = this.props.match.params
        // this.getAllBills();
        this.getDummyBill();
    }
    renderInventoryProductEditable(cellInfo) {
        cellInfo['row']['selectedItemInventory'] = {};
        cellInfo['row']['selectedItemInventory']['value'] = cellInfo['row']['id'];
        cellInfo['row']['selectedItemInventory']['label'] = cellInfo['row']['name'] + ' → ' + cellInfo['original']['subType'];
        const customStyles = {
            control: (base, state) => ({
                ...base,
                background: "#eaeaea",
                // match with the menu
                borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
                // Overwrittes the different states of border
                borderColor: state.isFocused ? "#eaeaea" : "#eaeaea",
                // Removes weird border around container
                boxShadow: state.isFocused ? null : null,
                "&:hover": {
                    // Overwrittes the different states of border
                    borderColor: state.isFocused ? "#80bdff" : "blue"
                }
            }),
            menu: base => ({
                ...base,
                // override border radius to match the box
                borderRadius: 1,
                // kill the gap
                marginTop: 0
            }),
            menuList: base => ({
                ...base,
                // kill the white space on first and last option
                padding: 0
            })
        };
        return (
            <Select
                menuPlacement={cellInfo.index > 2 ? "top" : "bottom"}
                styles={customStyles}
                className="form-control"
                placeholder="Select Inventory"
                value={cellInfo.row['selectedItemInventory']}
                onChange={(e) => this.handleChangeItemSelect(cellInfo, e)}
                options={this.state.inventory}
            />
        );
    }
    renderBrandEditable(cellInfo) {
        return (
            <input className="form-control" type="text" value={this.state.theBill[cellInfo.index].brand} onChange={(e) => this.handleChangeBrand(cellInfo, e)} />
        );
    }
    handleChangeBrand(cellInfo, e) {
        let cloneBill = this.state.theBill;
        cloneBill[cellInfo.index].brand = e.target.value;
        this.setState({
            theBill: cloneBill
        })
    }
    renderMrpEditable(cellInfo) {
        return (
            <input className="form-control" type="number" value={this.state.theBill[cellInfo.index].mrp} onChange={(e) => this.handleChangeMrp(cellInfo, e)} />
        );
    }
    handleChangeMrp(cellInfo, e) {
        let cloneBill = [...this.state.theBill];
        cloneBill[cellInfo.index].mrp = e.target.value;
        cloneBill[cellInfo.index].amount = this.calculateAmount(e.target.value, cloneBill[cellInfo.index].quantity, cloneBill[cellInfo.index].discount);
        this.setState({
            theBill: cloneBill
        })
    }
    renderQuantityEditable(cellInfo) {
        return (
            <input className="form-control" type="number" value={this.state.theBill[cellInfo.index].quantity} onChange={(e) => this.handleChangeQty(cellInfo, e)} />
        );
    }
    handleChangeQty(cellInfo, e) {
        let cloneBill = [...this.state.theBill];
        cloneBill[cellInfo.index].quantity = e.target.value;
        cloneBill[cellInfo.index].amount = this.calculateAmount(cloneBill[cellInfo.index].mrp, e.target.value, cloneBill[cellInfo.index].discount);
        this.setState({
            theBill: cloneBill
        })
    }
    renderDiscountEditable(cellInfo) {
        return (
            <input className="form-control" type="number" value={this.state.theBill[cellInfo.index].discount} onChange={(e) => this.handleChangeDiscount(cellInfo, e)} />
        );
    }
    handleChangeDiscount(cellInfo, e) {
        let cloneBill = [...this.state.theBill];
        cloneBill[cellInfo.index].discount = e.target.value;
        cloneBill[cellInfo.index].amount = this.calculateAmount(cloneBill[cellInfo.index].mrp, cloneBill[cellInfo.index].quantity, e.target.value);
        this.setState({
            theBill: cloneBill
        })
    }
    calculateAmount(rate, qty, disc) {
        let amount = 0;
        if (disc < 0 || !disc) {
            disc = 0
        }
        amount = ((rate * qty) - ((rate * qty) * (disc / 100)));
        return amount;
    }

    handleChangeItemSelect(cellInfo, selectedItemInventory) {
        cellInfo['row']['selectedItemInventory'] = selectedItemInventory;
        const cloneBill = [...this.state.theBill];
        if (!selectedItemInventory['discount']) {
            selectedItemInventory['discount'] = 0
        }
        cloneBill[cellInfo.index] = selectedItemInventory;
        this.setState({
            theBill: cloneBill
        })
    };
    getAllBills() {
        let jsonResponse = this.services.jsonFetch('getBillQuote')['billQuote'];
        this.setState({
            theBill: jsonResponse,
        })
    }
    getDummyBill() {
        let dummy = [{
            "sub_type": "",
            "product_name": "",
            "brand": "",
            "quantity": 0,
            "rate": 0,
            "mrp": 0,
            "discount": 0,
            "amount": 0,
            "inventory_id": undefined
        }]
        this.setState({
            theBill: dummy,
        })
    }
    addRowInBill(row) {
        let cloneBill = [...this.state.theBill];
        cloneBill[row.index + 1] = {
            "sub_type": "",
            "product_name": "",
            "brand": "",
            "quantity": 0,
            "rate": 0,
            "mrp": 0,
            "discount": 0,
            "amount": 0,
            "inventory_id": undefined
        }
        this.setState({
            theBill: cloneBill
        })
    }
    clearUp(row) {
        let cloneBill = [...this.state.theBill];
        cloneBill[row.index] = {
            "sub_type": "",
            "product_name": "",
            "brand": "",
            "quantity": 0,
            "rate": 0,
            "mrp": 0,
            "discount": 0,
            "amount": 0,
            "inventory_id": undefined
        }
        this.setState({
            theBill: cloneBill
        })
    }
    deleteRowInBill(row){
        let cloneBill = [...this.state.theBill];
        cloneBill.splice(row.index,1);
        this.setState({
            theBill: cloneBill
        })
    }
    getInventoryForSelect() {
        let temporaryInventory = [];
        const inventoryList = this.services.jsonFetch('inventory')['data']['rows'];
        for (let i = 0; i < inventoryList.length; i++) {
            const storedItem = inventoryList[i];
            let obj = {};
            obj = storedItem;
            obj['value'] = storedItem['id'];
            obj['label'] = storedItem['product_name'] + ' → ' + storedItem['sub_type'];
            temporaryInventory.push(obj);
        }
        this.setState({ inventory: temporaryInventory });
    }
    render() {
        const tabularBillConst = () => {
            return (
                <ReactTable
                    data={this.state.theBill}
                    columns={this.columns}
                    showPagination={false}
                    defaultPageSize={this.state.theBill.length +25}
                    className="main-billing"
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase()) }}
                />
            );
        }
        return (
            <div className="p-3 container-fluid">
                {
                    this.state.theBill.length > 0 &&
                    <div> {tabularBillConst()} </div>
                }
            </div>
        )
    }
}
