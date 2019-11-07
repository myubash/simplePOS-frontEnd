import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap';
import axios from 'axios';
import { addTableNum } from '../actions/index'
import Swal from 'sweetalert2';


export class Checkout extends Component {
    state = {
        arrOrder: [],
        sum: 0,
        arrItem: [],
        toggleModal: false,
        orderId: 0
    }
    tableNum = (num) => {
        this.props.addTableNum(num)
    }

    componentDidMount() {
        axios.get(
            'http://localhost:2000/orders',
            { params: { cooked: true } }
        )
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
        console.log(this.state.orderId)
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

    onSubmit = async () => {
        let array = [...this.state.arrOrder]
        let index = array.map(function (e) { return e.id; }).indexOf(this.state.orderId);
        try {
            let resp = await axios.post(
                'http://localhost:2000/orderhistory',
                { history: this.state.arrOrder[index] }
            )
            let res = await axios.delete(
                'http://localhost:2000/orders/' + this.state.orderId
            )
            Swal.fire({
                type: 'success',
                title: 'Checkout success'
            })
            // console.log(res)
            this.setState({ orderId: 0, toggleModal: !this.state.toggleModal })
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }

    renderOrder = () => {

        let result = this.state.arrOrder.map(order => {

            return (
                <Col xs='11' className='my-3 ' key={order.id}>
                    <Card className='bg-success text-light' onClick={() => this.openModal(order, order.id)}>
                        <Row>
                            <Col xs='4' className='ml-3 mt-3 mb-0'>
                                <h3 >Customer {order.customerTable}</h3>
                            </Col>
                            <Col xs='7' className=' ml-auto mr-3 mt-1 mb-0 d-flex justify-content-end'>
                                <h6>(OrderId - {order.id})</h6>
                            </Col>
                        </Row>
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

                </Col>
            )
        })
        return result
    }

    openModal = (data, id) => {
        // console.log(this.state.arrItem)
        this.setState({ arrItem: [{ ...data }], toggleModal: !this.state.toggleModal, orderId: id })
    }

    toggle = () => {
        this.setState({ toggleModal: !this.state.toggleModal })
    }

    renderConfirmation = () => {
        // console.log(this.state.arrItem)
        return this.state.arrItem.map(val => {
            return val.list.map(item => {
                let sum = parseInt(item.qty) * parseInt(item.productPrice)
                return (
                    <Row className='container-fluid mx-auto'>
                        <Col xs='12' className='border-bottom border-top border-dark p-0'>
                            <div className='d-flex py-4'>
                                <div className='pt-1 ml-2'>
                                    {item.productName}
                                </div>
                                <div className='ml-auto pt-1'>
                                    {item.qty} pcs X Rp. {item.productPrice}
                                </div>
                                <div className='ml-auto pt-1'>
                                    Total : Rp. {sum}
                                </div>
                            </div>
                        </Col>
                    </Row>
                )
            })
        })
    }



    render() {

        if (this.props.userName && this.props.userType === "cashier") {
            if (this.state.arrOrder.length > 0) {
                return (
                    <div className='container mt-4 checkoutOption'>
                        <Row className='justify-content-center'>
                            {this.renderOrder()}
                        </Row>
                        {
                            this.state.arrItem.length > 0
                                ?
                                <div>
                                    <Modal size='md' isOpen={this.state.toggleModal} toggle={this.toggle} className={this.props.className}>
                                        <ModalHeader toggle={this.toggle} className="px-auto ">Checkout confirmation</ModalHeader>
                                        <ModalBody>
                                            {this.renderConfirmation()}
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.onSubmit}>Confirm</Button>
                                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                                :
                                ''
                        }

                    </div>
                )
            }
            else {
                return (<div className='container mt-4 checkoutOption'>
                    <h1>EMPTY</h1>
                </div>
                )
            }
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

export default connect(mapStateToProps, { addTableNum })(Checkout)