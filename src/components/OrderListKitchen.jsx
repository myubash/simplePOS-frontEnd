import React, { Component } from 'react'
import { Redirect, } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardFooter } from 'reactstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import url from '../support/url'

export class OrderListKitchen extends Component {

    state = {
        arrOrder: []
    }

    async componentDidMount() {
        try {
            let res = await axios.get(
                url + '/order/kitchen',
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
                    if(val == dataList.customerTable){
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

    onDelete = async (customerTable) => {
        try {
            let res = await axios.delete(
                url + '/order/kitchen/' + customerTable
            )
            if(res.data.error) return alert(res.data.error)
            Swal.fire({
                type: 'success',
                title: 'Delete customer table-' + customerTable + ' success'
            })
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }

    onDone = async (customerTable) => {
        try {
            let res = await axios.patch(
                url + '/order/kitchen/' + customerTable
            )
            if(res.data.error) return alert(res.data.error)
            Swal.fire({
                type: 'success',
                title: 'Order customer table-' + customerTable + ' done',
                timer: 700
            })
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }

    renderOrder = () => {
        return this.state.arrOrder.map(val => {
            return (
                <Col xs='4' className=' my-2'>
                    <Card >
                        <div className='ml-2 mt-2'>
                            <h4 >Customer {val.customerTable}</h4>
                        </div>
                        <CardBody className=' px-3 py-1'>
                            {this.renderListOrder(val.customerTable)}
                        </CardBody>
                        <CardFooter className='d-flex'>
                            <button className='btn btn-danger' onClick={() => this.onDelete(val.customerTable)}>Decline order</button>
                            <button className='btn btn-success ml-auto px-5' onClick={() => this.onDone(val.customerTable)}> DONE</button>
                        </CardFooter>
                    </Card>
                </Col>
            )
        })
    }

    renderListOrder = (customer) => {
        return this.state.arrOrder.map(order => {
            if (order.customerTable === customer) {
                return order.list.map(item => {
                    // sum = sum + (parseInt(item.productPrice) * parseInt(item.qty))
                    return (<div className='d-flex py-2'>
                        <div>
                            <span className='mr-2'>{item.productName}</span>
                        </div>
                        <div className='ml-auto'>
                            <span className='ml-2'>{item.qty} pcs</span>
                        </div>
                    </div>
                    )
                })
            }
        })
    }

    render() {
        if (this.props.userName && this.props.userType === "kitchen") {
            return (
                <div className='container'>
                    <Row className='align-content-between mt-4 '>
                        {this.state.arrOrder.length === 0 ? <h1>EMPTY</h1> : this.renderOrder()}
                    </Row>
                </div>
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
            )
        } else if (this.props.userType === "waiter") {
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
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, null)(OrderListKitchen)
