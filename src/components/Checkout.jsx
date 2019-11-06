import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';
import axios from 'axios';

export class Checkout extends Component {
    state = {
        arrOrder: [],
        sum: 0
    }

    componentDidMount() {
        axios.get('http://localhost:2000/orders')
            .then(res => {
                this.setState({ arrOrder: res.data })
            })
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
    dor = () => {
        console.log('asu')
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
        return aaaaaaaaa
    }
    change = async (id, _paid) => {
        try {
            let res = await axios.patch(
                'http://localhost:2000/orders/' + id,
                {
                    paid: !_paid
                }
            )
            alert('Update success')
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }

    }

    renderOrder = () => {
        let result = this.state.arrOrder.map(order => {
            if (order.paid) {
                return (
                    <Col xs='11' className='my-3 ' key={order.id}>
                        {/* <Link to='#' className='text-decoration-none'> */}
                        <Card className='bg-success text-light' onClick={() => this.change(order.id, order.paid)} >
                            <h3 className='ml-3 mt-3 mb-0'>Customer {order.customerTable}</h3>
                            <CardBody className='m-0'>
                                {this.renderListOrder(order.customerTable)}
                                <div className='d-flex border-top border-light my-2'>
                                    <div>
                                        <h3>Total price :</h3>
                                    </div>
                                    <div className='ml-auto'>
                                        <h3>
                                            Rp. {this.totalSum(order.customerTable)}
                                        </h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        {/* </Link> */}
                    </Col>
                )
            } else {
                return (
                    <Col xs='11' className='my-3 ' key={order.id}>
                        {/* <Link to='#' className='text-decoration-none'> */}
                        <Card className='bg-danger text-light' onClick={() => this.change(order.id)}>
                            <h3 className='ml-3 mt-3 mb-0'>Customer {order.customerTable}</h3>
                            <CardBody className='m-0'>
                                {this.renderListOrder(order.customerTable)}
                                <div className='d-flex border-top border-light my-2'>
                                    <div>
                                        <h3>Total price :</h3>
                                    </div>
                                    <div className='ml-auto'>
                                        <h3>
                                            Rp. {this.totalSum(order.customerTable)}
                                        </h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        {/* </Link> */}
                    </Col>
                )
            }

        })
        return result
    }



    render() {

        if (this.props.userName && this.props.userType === "cashier") {
            return (
                <div className='container mt-4 checkoutOption'>
                    <Row className='justify-content-center'>
                        {this.renderOrder()}
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

export default connect(mapStateToProps, null)(Checkout)