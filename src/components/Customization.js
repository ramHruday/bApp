import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import '../custom.css'

export default class Customization extends Component {
    constructor(props) {
        super(props);
        this.uploadBrandImage = this.uploadBrandImage.bind(this);
        this.state = {
            brandImage: null,
            userRoles: [{
                userName: "",
                password: "",
                role: ""
            }]
        };
    }
    getUserProfilePic() {

    }
    uploadBrandImage(event) {
        try {
            if (event.target.files && event.target.files[0] && event.target.files[0].size < 5000000) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                // tslint:disable-next-line:no-shadowed-variable
                reader.onload = (childEvent) => {
                    this.setState({
                        brandImage: childEvent.target['result']
                    })
                };
            } else if (event.target.files[0].size > 5000000) {
                this.toaster.open('warning', '', 'max File size for upload is 5mb');
            }
        } catch (error) {
            console.log(error);
        }
    }
    addUserAccordion() {
        let cloneUserRoles = [...this.state.userRoles];
        cloneUserRoles.push(
            {
                userName: "",
                password: "",
                role: ""
            }
        )
        this.setState({
            userRoles: cloneUserRoles
        })
    }
    deleteUserAccordion(i) {
        let cloneUserRoles = [...this.state.userRoles];
        cloneUserRoles.splice(i, 1);
        this.setState({
            userRoles: cloneUserRoles
        })
    }
    render() {
        const userAccordion = this.state.userRoles.map((userRole, i) =>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={i}>
                        User {i + 1}
                    </Accordion.Toggle>
                    <div className="float-right">
                        {this.state.userRoles.length - 1 === i &&
                            <button className="btn btn-sm action" title="Add" onClick={() => this.addUserAccordion()}><i class="fas fa-plus"></i></button>}
                        {this.state.userRoles.length !== 1 &&
                            <button className="btn btn-sm action" title="Delete" onClick={() => this.deleteUserAccordion(i)}><i class="far fa-trash-alt"></i></button>}
                    </div>
                    <Accordion.Collapse eventKey={i}>
                        <Form.Row className="p-4">
                            <Form.Group as={Col} md="4">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="username" value={userRole.userName} />
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="password" value={userRole.password} />
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select" value={userRole.role}>
                                    <option>pro-Admin</option>
                                    <option>Admin</option>
                                    <option>Sales</option>
                                    <option>Cashier</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

        );
        return (
            <React.Fragment>
                <input id="myInput" type="file" ref={(ref) => this.upload = ref} onChange={this.uploadBrandImage} style={{ display: 'none' }} />
                <div className="avatar image-container"
                    onClick={(e) => this.upload.click()}>
                    <img src={this.state.brandImage} alt="" />
                    <i className="fas fa-upload"></i>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-sm-12 custom-align-center">
                            <Form>
                                <Form.Group>
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Product Name" />
                                </Form.Group>
                                <div className="col-md-12">
                                    <h6>User Roles</h6>
                                </div>
                                <div className="user-role-list p-3">
                                    {userAccordion}
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className="row fixed-bottom">
                        <div className="custom-align-center">
                            <a href="/login">Logout</a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
