import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';
import { FaUtensils, FaMoneyBillWave } from "react-icons/fa";
import { GoCalendar } from "react-icons/go";

export class HomeCashier extends Component {
    render() {
        if (this.props.userName && this.props.userType === "cashier") {
            return (

                <div className='app'>

                    <Row className="justify-content-around mt-5 container-fluid">
                        <Col xs='3' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/table'>
                                    <CardBody className="text-center">
                                        <FaUtensils style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">ORDER</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='3' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/reservation'>
                                    <CardBody className='text-center'>
                                        <GoCalendar style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">RESERVATION</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='3' className='mt-5 pt-5'>
                            <Card>
                                <Link to="/checkout">
                                    <CardBody className='text-center'>
                                        <FaMoneyBillWave style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">CHECKOUT</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
            )
        } else {
            return (
                <Redirect to='/' />
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, null)(HomeCashier)
