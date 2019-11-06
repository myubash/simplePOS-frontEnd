import React, { Component } from 'react'
import { Transition } from 'react-transition-group'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import axios from 'axios'
import { delTableNum } from '../../actions/index'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'




const duration = 500

const sidebarStyle = {
    transition: `width ${duration}ms`
}
const sidebarTransitionStyles = {
    entering: { width: 0 },
    entered: { width: '300px' },
    exiting: { width: '300px' },
    exited: { width: 0 }
}
const linkStyle = {
    transition: `opacity ${duration}ms`
}
const linkTransitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}

class SidebarContent extends Component {
    state = {
        arrOrder: [],
        tableNum: 0
    }

    renderOrders = () => {
        // let { id, customerId, orderDetail, status } = this.state.arrOrder
        return this.state.arrOrder.map(order => {
            return (
                <Row className='container mx-auto'>
                    <Col xs='11' className='border-bottom border-top border-dark p-0'>
                        <div className='d-flex py-4'>
                            <div className='pt-1 ml-2'>
                                {order.productName}
                            </div>
                            <div className='ml-auto pt-1'>
                                Qty : {order.qty}
                            </div>
                            <div className='ml-auto'>
                                <button className='btn btn-danger' onClick={() => this.delete(order.productId)}>X</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            )
        })
    }
    renderConfirmation = () => {
        return this.state.arrOrder.map(order => {
            return (
                <Row className='container mx-auto'>
                    <Col xs='11' className='border-bottom border-top border-dark p-0'>
                        <div className='d-flex py-4'>
                            <div className='pt-1 ml-2'>
                                {order.productName}
                            </div>
                            <div className='ml-auto pt-1'>
                                Qty : {order.qty}
                            </div>
                        </div>
                    </Col>
                </Row>
            )
        })
    }
    delete = (id) => {
        let array = [...this.state.arrOrder]
        let index = array.map(function (e) { return e.productId; }).indexOf(id);
        if (index === -1) return alert('No index')
        array.splice(index, 1)
        this.setState({ arrOrder: array })
    }
    dor = (order) => {
        console.log(this.state.arrOrder)
    }


    UNSAFE_componentWillMount() {
        this.setState({ arrOrder: [...this.state.arrOrder, ...this.props.order] })
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({ arrOrder: [...this.state.arrOrder, ...this.props.order] })
    }


    renderLinks = () => {
        return <Transition in={this.props.isOpen} timeout={duration}>
            {(state) => (
                <div className='mt-2' style={{
                    ...linkStyle,
                    ...linkTransitionStyles[state]
                }}>
                    <div>
                        {this.renderOrders()}
                    </div>
                </div>
            )}
        </Transition>
    }
    onSubmit = () => {
        this.toggle()
        axios.post(
            'http://localhost:2000/orders',
            {
                list: this.state.arrOrder,
                customerTable: this.props.tableNum,
                paid: false
            }
        )
            .then(res => {
                console.log(res)
                this.props.delTableNum()
                Swal.fire({
                    type: 'success',
                    title: 'Ordered'
                })

            })
            .catch(err => {
                console.log(err)
            })
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    render() {

        return <Transition in={this.props.isOpen} timeout={duration}>
            {(state) => (
                <div className="sidebar" style={{
                    ...sidebarStyle,
                    ...sidebarTransitionStyles[state]
                }}>
                    <div>
                        {this.renderLinks()}
                    </div>
                    {
                        this.state.arrOrder.length > 0
                            ?
                            <div>
                                <button className='btn btn-block btn-primary mt-5 py-3 px-0' onClick={this.toggle}>Submit order</button>
                                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                    <ModalHeader toggle={this.toggle} className="px-auto ">Edit Product</ModalHeader>
                                    <ModalBody>
                                        {this.renderConfirmation()}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Link to='/table'>
                                            <Button color="primary" onClick={this.onSubmit}>Confirm</Button>
                                        </Link>
                                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                            :
                            ''
                    }


                </div>
            )}
        </Transition>


    }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType,
        tableNum: state.tableNum.tableNum
    }
}

export default connect(mapStateToProps, { delTableNum })(SidebarContent) 