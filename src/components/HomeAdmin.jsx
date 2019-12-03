import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';
import { FaPencilAlt, FaChair, FaHistory, FaUsers, FaListUl } from 'react-icons/fa'
import { MdRestaurantMenu } from 'react-icons/md'


export class HomeAdmin extends Component {
    render() {
        if (this.props.userName && this.props.userType === "admin") {
            return (
                <div className='sidebar'>
                    <Row className="justify-content-around mt-0 container-fluid">
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/register'>
                                    <CardBody className="text-center">
                                        <FaPencilAlt style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">REGISTER USER</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/transactionhistory'>
                                    <CardBody className="text-center">
                                        <FaHistory style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">TRANSACTION HISTORY</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/employeelist'>
                                    <CardBody className="text-center">
                                        <FaUsers style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">EMPLOYEE LIST</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/newmenusuggestion'>
                                    <CardBody className="text-center">
                                        <MdRestaurantMenu style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">NEW MENU SUGGESTION</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/reservationlist'>
                                    <CardBody className="text-center">
                                        <FaChair style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">RESERVATION LIST</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card>
                                <Link to='/menulist'>
                                    <CardBody className="text-center">
                                        <FaListUl style={{ height: '100px', width: '100px' }} />
                                        <h1 className="my-3 text-dark">MENU LIST</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ height: 100 }}></div>
                </div>
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
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

export default connect(mapStateToProps, null)(HomeAdmin)
