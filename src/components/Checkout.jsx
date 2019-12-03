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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "./Invoice";



export class Checkout extends Component {
    state = {
        arrOrder: [],
        sum: 0,
        arrItem: [],
        toggleModal: false,
        totalSum: 0
    }
    tableNum = (num) => {
        this.props.addTableNum(num)
    }

    async componentDidMount() {
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

    renderListOrder = (customer) => {
        return this.state.arrOrder.map(order => {
            if (order.customerTable === customer) {
                return order.list.map(item => {
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

        

        // let array = []
        // array.push(this.state.arrItem[0].list)
        // array[0].forEach(function(v) {
        //     delete v.productName;
        // });
        // array[0].forEach(function(v) {
        //     delete v.productPrice;
        // });
        // let data = array[0].reduce(
        //     (acc, obj) => [...acc, Object.values(obj).map(y => parseInt(y))],
        //     []
        // );
        // let address = url + '/order/cashier/' + data[0][2]
        // console.log(address)
        // try {
        //     let address = url + '/order/cashier/' + data[0][2]
        //     let resp = await axios.post(
        //         address,
        //         { list: data }
        //     )
        //     if(resp.data.error) return alert(resp.data.error)
        //     Swal.fire({
        //         type: 'success',
        //         title: 'Checkout success',
        //         timer: 700
        //     })
        //     this.setState({ orderId: 0, toggleModal: !this.state.toggleModal })
        //     this.componentDidMount()
        //     console.log(resp)
        // } catch (error) {
        //     console.log(error)
        // }
    }

    renderOrder = () => {

        let result = this.state.arrOrder.map(order => {
            let sum = this.totalSum(order.customerTable)
            return (
                <PDFDownloadLink
                    className='col-10 p-0 m-3'
                    document={<PdfDocument data={order} cashier={this.props.userName} customer={order.customerTable}  />}
                    fileName= {Date.now() + "-invoice.pdf"}
                    style={{
                    textDecoration: "none",
                    color: "#4a4a4a",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #4a4a4a"
                    }}
                >
                    <Col xs='12' className='p-0'  key={order.id}>
                        <Card className='bg-success text-light' onClick={() => this.openModal(order, sum)}>
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
                                            Rp. {sum}
                                        </h3>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </PDFDownloadLink>
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
                                    {item.qty} pcs X Rp. {item.productPrice}
                                </div>
                                <div className='ml-auto pt-1'>
                                    : Rp. {sum}
                                </div>
                            </div>
                        </Col>
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
                                        <Row className='container-fluid mx-auto'>

                                            {this.renderConfirmation()}
                                            <div className='ml-auto pt-1'>
                                                Total : Rp. {this.state.totalSum}
                                            </div>
                                            </Row>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="info" onClick={this.onSubmit}>Confirm</Button>
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