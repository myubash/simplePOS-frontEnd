import React, { Component } from 'react'
import { Redirect, } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardFooter } from 'reactstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import url from '../support/url'

export class OrderListKitchen extends Component {

    state = {
        arrOrder: [],
        time: 1000,
        seconds: 5
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
                dataCust['name'] = null
                var temp = []

                list.forEach((dataList) => {
                    if(val == dataList.customerTable){
                        temp.push(dataList)
                        // if(dataList.customerTable.split('-').length === 2){
                        //     dataCust.name = dataList.customerTable.split('-')[1]
                        // }
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
    }


    onDelete = async (customerTable) => {
        try {
            let res = await axios.delete(
                url + '/order/kitchen/' + customerTable
            )
            if(res.data.error) return alert(res.data.error)
            Swal.fire({
                type: 'success',
                title: 'Delete customer ' + customerTable + ' success'
            })
            this.getData()
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
                title: 'Order customer' + customerTable + ' done',
                timer: 700
            })
            this.getData()
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

    onRetry = () => {
        this.setState({seconds:5})
        this.componentDidMount()
    }

    render() {
        if (this.props.userName && this.props.userType === "kitchen") {
            if(this.state.arrOrder.length){
                return (
                    <div className='container'>
                        <Row className='align-content-between mt-4 '>
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
                                <p className='textBack' onClick={() => {this.props.history.push('/cashier');clearInterval(this.interval)}}>Back to home</p>
                                </h6>
                            </h1>
                            : <h1>Loading... Timeout: {seconds < 10 && seconds > 1 ? `0${seconds} seconds` : seconds === 1 ? `${seconds} second` : `${seconds} seconds`}</h1>
                        }
                    </div>
                )
            }
            
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
