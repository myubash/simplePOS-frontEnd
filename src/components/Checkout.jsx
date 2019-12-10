import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from 'reactstrap';
import axios from 'axios';
import { addTableNum } from '../actions/index'
import Swal from 'sweetalert2';
import url from '../support/url'
import NumberFormat from 'react-number-format'



export class Checkout extends Component {
    state = {
        arrOrder: [],
        sum: 0,
        arrItem: [],
        toggleModal: false,
        totalSum: 0,
        time: 1000,
        seconds: 5
    }
    tableNum = (num) => {
        this.props.addTableNum(num)
    }

    async componentDidMount() {
        this.interval = setInterval(()=>this.getData(), this.state.time);
        this.myInterval = setInterval(() => {
            const { seconds } = this.state
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                    clearInterval(this.myInterval)
            } 
        }, 1000)
        
    }

    getData = async () => {
        try {
            let res = await axios.get(
                url + '/order/cashier',
            )
            if(res.data.error) return alert(res.data.error)
            var list = res.data.list
            let data = []
            let dor = res.data.list.forEach(val => {
                data.push(val.customerTable)
            })
            let jedor = [...new Set(data)]
            var dataCustList = []
            jedor.forEach((val) => {
                var dataCust = {}
                dataCust['customerTable'] = val
                dataCust['list'] = []
                var temp = []
                list.forEach((dataList) => {
                    if(val === dataList.customerTable){
                        temp.push(dataList)
                    }
                })
                dataCust['list'] = temp
                dataCustList.push(dataCust)
            })
            console.log(dataCustList)
            this.setState({ arrOrder: dataCustList })

        } catch (error) {
            console.log(error)
        }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.myInterval);
    }

    renderListOrder = (customer) => {
        return this.state.arrOrder.map(order => {
            if (order.customerTable === customer) {
                return order.list.map(item => {
                    return (<div className='d-flex py-2'>
                        <div>
                            <span className='mr-2'>{item.productName}</span> X <span className='ml-2'>{item.qty} pcs</span>
                        </div>
                        <div className='ml-auto'>
                            <NumberFormat value={parseInt(item.productPrice) * parseInt(item.qty)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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

    

    renderOrder = () => {

        let result = this.state.arrOrder.map(order => {
            let sum = this.totalSum(order.customerTable)
            return (
                    <Col xs='12' className='p-0 m-3'  key={order.id}>
                        <Link className='nav-link' to={{pathname:'/checkoutconfirmation',customerTable:order.customerTable}}>
                        <Card className='text-light checkoutBtn'>
                            <Row>
                                <Col xs='4' className='ml-3 mt-3 mb-0'>
                                    <h3 >Customer {order.customerTable}</h3>
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
                                            <NumberFormat value={sum} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                        </h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        </Link>
                    </Col>
            )
        })
        return result
    }

    openModal = (data, sum) => {
        // console.log(this.state.arrItem)
        this.setState({ arrItem: [{ ...data }], toggleModal: !this.state.toggleModal, totalSum: sum })
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
                        <Col xs='12' className='border-bottom border-top border-dark p-0'>
                            <div className='d-flex py-4'>
                                <div className='pt-1 ml-2'>
                                    {item.productName}
                                </div>
                                <div className='ml-auto pt-1'>
                                    {item.qty} pcs X Rp {item.productPrice}
                                </div>
                                <div className='ml-auto pt-1'>
                                    : Rp {sum}
                                </div>
                            </div>
                        </Col>
                )
            })
        })
    }

    onRetry = () => {
        this.setState({seconds:5})
        this.componentDidMount()
    }



    render() {
        if (this.props.userName && this.props.userType === "cashier") {
            if (this.state.arrOrder.length > 0) {
                return (
                    <div className='container mt-4 checkoutOption'>
                        <Row className='justify-content-center'>
                            {this.renderOrder()}
                        </Row>
                    </div>
                )
            }
            if(!this.state.arrOrder.length){
                const { seconds } = this.state
                return (
                    <div className='container text-center mt-4'>
                        { seconds === 0
                            ? <h1>
                                No order yet...
                                <h6 className='m-4'>
                                <p className='textBack' onClick={this.onRetry}>Retry get data</p>
                                <p className='textBack' onClick={() => {this.props.history.push('/cashier')}}>Back to home</p>
                                </h6>
                            </h1>
                            : <h1>Loading... Timeout: {seconds < 10 && seconds > 1 ? `0${seconds} seconds` : seconds === 1 ? `${seconds} second` : `${seconds} seconds`}</h1>
                        }
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