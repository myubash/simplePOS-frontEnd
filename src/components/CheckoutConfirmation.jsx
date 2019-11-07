import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';

export class CheckoutConfirmation extends Component {

    state = {
        arrOrder: []
    }

    async componentDidMount() {
        try {
            let res = await axios.get('http://localhost:2000/orders',
                {
                    params: {
                        customerTable: this.props.tableNum
                    }
                }
            )
            console.log(res)
            this.setState({ arrOrder: res.data })
        } catch (error) {
            console.log(error)
        }
    }

    renderListOrder = (customer) => {
        return this.state.arrOrder.map(order => {
            if (order.customerTable === customer) {
                return order.list.map(item => {
                    // sum = sum + (parseInt(item.productPrice) * parseInt(item.qty))
                    return (<div className='d-flex py-2'>
                        <div>
                            <span className='mr-2'>{item.productName}</span> X <span className='ml-2'>{item.qty} pcs</span>
                        </div>
                        <div className='ml-auto'>
                            = Rp. {parseInt(item.productPrice) * parseInt(item.qty)}
                        </div>
                    </div>
                    )
                })
            }
        })
    }

    totalSum = (table) => {
        let sum = 0
        this.state.arrOrder.map(item => {
            if (item.customerTable === table) {
                item.list.map(val => {
                    sum += parseInt(val.productPrice) * parseInt(val.qty)
                })
            }
        })
        return sum
    }

    renderConfirmation = () => {
        return this.state.arrOrder.map(val => {
            return (
                <Col xs='11' className='my-3 ' key={val.id}>
                    <Link to='/checkoutconfirmation' className='text-decoration-none'>
                        <Card className='text-dark' onClick={() => this.tableNum(val.customerTable)}>
                            <Row>
                                <Col xs='3' className='ml-3 mt-3 mb-0'>
                                    <h3 >Customer {val.customerTable}</h3>
                                </Col>
                                <Col xs='8' className=' ml-auto mr-3 mt-1 mb-0 d-flex justify-content-end'>
                                    <h6>(OrderId - {val.id})</h6>
                                </Col>
                            </Row>

                            <CardBody className='m-0'>
                                {this.renderListOrder(val.customerTable)}
                                <div className='d-flex border-top border-danger my-2'>
                                    <div>
                                        <h3>Total price :</h3>
                                    </div>
                                    <div className='ml-auto'>
                                        <h3>
                                            Rp. {this.totalSum(val.customerTable)}
                                        </h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Link>
                </Col>
            )

        })
    }

    render() {
        if (this.props.userName && this.props.userType === "cashier") {
            return (
                <div className='container-fluid mt-4 checkoutOption'>
                    <Row className='justify-content-center'>
                        {this.renderConfirmation()}
                    </Row>
                </div>
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
            )
        }
        else if (!this.props.userType === 'waiter') {
            return (
                <Redirect to='/waiter' />
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
        userType: state.auth.userType,
        tableNum: state.tableNum.tableNum
    }
}

export default connect(mapStateToProps, null)(CheckoutConfirmation)
