// /* global gapi */
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.submitCredentials = this.submitCredentials.bind(this);
        this.state = {

        };
    }
    onSuccess(googleUser) {
        const profile = googleUser.getBasicProfile();
        console.log("Name: " + profile.getName());
    }
    submitCredentials() {
        this.props.history.push("/inventory")
    }
    render() {
        return (
            <div className="container-fluid mainImage">
                <div className="row">
                    <div className="col-lg-4 col-sm-12 custom-align-center h-100vh login-card ">
                        {/* <div className="center-text">
                            <h3><b>bApp</b></h3>
                            <h5>Business Suite</h5>
                        </div> */}
                        <Form className="p-5 mt-5rem">
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter User Name." />
                            </Form.Group>

                            <Form.Group >
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" className="float-right" type="submit" onClick={this.submitCredentials}>
                                Submit
                            </Button>
                        </Form>
                        <hr></hr>
                    </div>
                </div>
            </div >
        )
    }
}
