import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import httpServiceLayer from '../services/http-service-layer';
import ReactTable from 'react-table';
// import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import _ from "lodash";


export default class Billing extends Component {
    constructor(props) {
        super(props);
        this.opensBill = this.opensBill.bind(this);
        this.state = {
            billsAll: {
                archivedBills: [],
                pendingBills: [],
                createBills: [],
                opensBillSheet: undefined
            },
            backUpBills: {
                archivedBills: [],
                pendingBills: [],
                createBills: [],
                opensBillSheet: undefined
            },
            avgDisc: 0,
            totalBillCost: 0,
            itemCount: 0,
            billQuote: [],
            archivedSearch: '',
            pendingSearch: ''
        };
        this.columns = [
            {
                "accessor": "name",
                "filterable": true,
                "Header": "Name"
            },
            {
                "filterable": true,
                "accessor": "subType",
                "Header": "Sub type"
            },
            {
                "filterable": true,
                "accessor": "brand",
                "Header": "Brand"
            },
            {
                "filterable": true,
                "accessor": "mrp",
                "Header": "MRP"
            },
            {
                "filterable": true,
                "accessor": "quantity",
                "Header": "Quantity",
                Footer: () => (
                    <span>
                        <strong>Count</strong>:  {this.state.itemCount}
                    </span>
                )
            },
            {
                "filterable": true,
                "accessor": "discount",
                "Header": "Discount %",
                Footer: () => (
                    <span>
                        <strong>Avg</strong>:  {this.state.avgDisc}
                    </span>
                )
            },
            {
                "filterable": true,
                "accessor": "rate",
                "Header": "Rate"
            },
            {
                "filterable": true,
                "accessor": "amount",
                "Header": "Amount",
                Footer: () => (
                    <span>
                        <strong>Total</strong>:  {this.state.totalBillCost}
                    </span>
                )
            }
        ]
        this.services = new httpServiceLayer();
    }
    componentDidMount() {
        this.getAllBills();

    }
    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    getAllBills() {
        let jsonResponse = this.services.jsonFetch('getBills')['data'];
        this.setState({
            billsAll: jsonResponse,
            backUpBills: jsonResponse
        })
    }
    getFooterValues() {
        this.setState({
            avgDisc: _.round(_.mean(_.map(this.state.billQuote, d => d.discount))),
            totalBillCost: _.sumBy(this.state.billQuote, 'amount'),
            itemCount: _.sumBy(this.state.billQuote, 'quantity'),
        })
    }
    opensBill(bill) {
        this.setState({
            billQuote: this.services.jsonFetch('getBillQuote')['billQuote'],
            opensBillSheet: bill,
        })
        setTimeout(() => {
            this.getFooterValues()
        });
    }
    openThisBillForEdit(bill_id) {
        this.props.history.push('/bill/' + bill_id);
    }
    handleArchivedSearchBar = (event) => {
        this.setState({
            archivedSearch: event.target.value
        }, () => {
            if (this.state.archivedSearch.length > 0) {
                this.setState({
                    billsAll: {
                        archivedBills: this.filterByValue(this.state.backUpBills.archivedBills, this.state.archivedSearch),
                        pendingBills: this.state.billsAll.pendingBills,
                        createBills: this.state.billsAll.createBills,
                        opensBillSheet: this.state.billsAll.opensBillSheet
                    }
                })
            } else {
                this.setState({
                    billsAll: this.state.backUpBills
                })
            }
        })
    }
    handlePendingSearchBar = (event) => {
        this.setState({
            pendingSearch: event.target.value
        }, () => {
            if (this.state.pendingSearch.length > 0) {
                this.setState({
                    billsAll: {
                        archivedBills: this.state.backUpBills.archivedBills,
                        pendingBills: this.filterByValue(this.state.backUpBills.pendingBills, this.state.pendingSearch),
                        createBills: this.state.billsAll.createBills,
                        opensBillSheet: this.state.billsAll.opensBillSheet
                    }
                })
            } else {
                this.setState({
                    billsAll: this.state.backUpBills
                })
            }
        })
    }
    filterByValue(array, string) {
        return array.filter(o =>
            Object.keys(o).some(k => (o[k]).toString().toLowerCase().includes(string.toLowerCase())));
    }
    render() {
        const tabularBillConst = () => {
            return (
                <ReactTable
                    data={this.state.billQuote}
                    columns={this.columns}
                    style={{ 'whitespace': 'no-wrap' }}
                    showPagination={false}
                    defaultPageSize={this.state.billQuote.length}
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase()) }}
                />
            );
        }
        const archivedBills = this.state.billsAll['archivedBills'].map((bill, i) =>
            <ListGroup.Item action key={bill.bill_id} className={i % 2 ? 'evenListItem' : 'oddListItem'} onClick={() => this.opensBill(bill)}>
                <span className="small">
                    Bill ID:  {bill.bill_id}
                </span>
                <span className="float-right small">
                    <i className="fas fa-calendar-alt"></i>{bill.bill_date}
                </span>
                <p>
                    Billed For:  {bill.bill_customer}
                </p>
                <span><i className="fas fa-rupee-sign"></i> {bill.bill_total}</span>
                <span className="float-right small">
                    Billed by:  {bill.billed_by}
                </span>
            </ListGroup.Item>

        );
        const pendingBills = this.state.billsAll['pendingBills'].map((bill, i) =>
            <ListGroup.Item action key={bill.bill_id} className={i % 2 ? 'evenListItem' : 'oddListItem'} onClick={() => this.opensBill(bill)}>
                <span className="small">
                    Bill ID:  {bill.bill_id}
                </span>
                <span className="float-right small">
                    <i className="fas fa-clock"></i>{bill.bill_date}
                </span>
                <p>
                    Billed For:  {bill.bill_customer}
                </p>
                <span><i className="fas fa-rupee-sign"></i> {bill.bill_total}</span>
                <span className="float-right small">
                    <i className="fas fa-user-tie"></i>  {bill.billed_by}
                </span>
            </ListGroup.Item>
        );
        return (
            <div className="p-3 container-fluid">
                <Tab.Container id="left-tabs-example" defaultActiveKey="archivedBills">
                    <Row>
                        <Col sm={2}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="archivedBills">Archived Bills <i className="fas fa-clipboard-check float-right p-1 green"></i></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="pendingBills">Pending Bills <i className="fas fa-hourglass-half float-right p-1 orange"></i></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="createBills">Create New <i className="fas fa-cart-plus float-right p-1 blue"></i></Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={3} className={!this.isMobileDevice() ? 'bills-list-view pb-5' : 'pb-5'}>
                            <Tab.Content>
                                <Tab.Pane eventKey="archivedBills">
                                    <div className="card">
                                        <input className="form-control" type="search" autoFocus={true} placeholder="Search here" onChange={this.handleArchivedSearchBar} />
                                        {/* {this.state.billsAll.archivedBills.length} */}
                                    </div>
                                    <ListGroup >
                                        {archivedBills}
                                    </ListGroup>
                                </Tab.Pane>
                                <Tab.Pane eventKey="pendingBills">
                                    <div className="card">
                                        <input className="form-control" type="search" autoFocus={true} placeholder="Search here" onChange={this.handlePendingSearchBar} />
                                        {/* <span className="col-2">{this.state.billsAll.pendingBills.length}</span> */}
                                    </div>
                                    <ListGroup >
                                        {pendingBills}
                                    </ListGroup>
                                </Tab.Pane>
                                <Tab.Pane eventKey="createBills">
                                    <ListGroup>
                                        <ListGroup.Item action>
                                            Quotation
                                            <i className="fas fa-arrow-right p-1 float-right"></i>
                                            <p className="small">
                                                A formal statement of promise (by potential supplier to supply the goods required by a buyer, at specified prices,
                                                 and within a specified period.
                                            </p>
                                        </ListGroup.Item>
                                        <ListGroup.Item action>
                                            GST Bill
                                            <i className="fas fa-arrow-right p-1 float-right"></i>
                                            <p className="small">
                                                GST is a single tax on the supply of goods and services, right from the manufacturer to the consumer.
                                            </p>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                        <Col sm={7} >
                            {/* <h5>
                                Bill ID:
                                {this.state.opensBillSheet &&
                                    <React.Fragment>
                                        {this.state.opensBillSheet.bill_id}
                                    </React.Fragment>}
                            </h5> */}
                            <Container>
                                <div className="row bg-dark">{
                                    this.state && this.state.opensBillSheet && this.state.opensBillSheet.bill_id &&
                                    <button className="btn btn-sm action m-auto" title="Edit" onClick={() => this.openThisBillForEdit(this.state.opensBillSheet.bill_id)}><i className="fas fa-pen"></i></button>
                                }
                                    <button className="btn btn-sm action m-auto" title="Download" ><i className="fas fa-file-download"></i></button>
                                    <button className="btn btn-sm action m-auto" title="Bill"><i className="fas fa-file-invoice-dollar"></i></button>
                                    {/* <button className="btn btn-sm action m-auto" title="Star" >{this.state.opensBillSheet && this.state.opensBillSheet.starred ? <i className="fas fa-star yellow"></i> : <i className="far fa-star"></i>}</button> */}
                                </div>
                                <Row>
                                    <Col md="12" lg="12" sm="12" className="p-0">
                                        {
                                            this.state.billQuote.length > 0 &&
                                            <div> {tabularBillConst()} </div>
                                        }
                                    </Col>
                                </Row>
                                {this.state.opensBillSheet &&
                                    <div className="p-4">
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={2}>
                                                Billed For:
                                            </Form.Label>
                                            <Col sm={4}>
                                                <Form.Control as="textarea" rows="3" type="text" plaintext readOnly value={`${this.state.opensBillSheet.bill_customer}\n${this.state.opensBillSheet.customer_contact}`} />
                                            </Col>
                                            <Form.Label column sm={2}>
                                                Invoice Date
                                        </Form.Label>
                                            <Col sm={4}>
                                                <Form.Control type="text" plaintext readOnly value={this.state.opensBillSheet.bill_date} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm={2}>
                                                Agent yo
                                            </Form.Label>
                                            <Col sm={4}>
                                                <Form.Control type="text" plaintext readOnly value={this.state.opensBillSheet.billed_by} />
                                            </Col>
                                            <Form.Label column sm={2}>
                                                Closed On
                                        </Form.Label>
                                            <Col sm={4}>
                                                <Form.Control type="date" placeholder="" />
                                            </Col>
                                        </Form.Group>
                                    </div>
                                }
                            </Container>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}
