import React, { Component } from 'react'
import Sidebar from './sidebar/Sidebar'
import { Row, Col, Card, CardImg, CardTitle, } from 'reactstrap'
import darwin from '../assets/darwin.png'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { delTableNum } from '../actions/index'

export class Order extends Component {
    state = {
        arrMenu: [],
        productDetail: [],
        arrOrder: [],
        tableNum: this.props.num,
        qty: 0,
        modal: false
    }

    // this.state.arrorder[?].qty
    // this.state.arrorder[?].productid

    componentDidMount() {
        axios.get(
            'http://localhost:2000/menu'
        )
            .then(res => {
                this.setState({ arrMenu: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }


    renderLauk = () => {
        let result = this.state.arrMenu.map(product => {
            if (product.productType === 'Lauk') {
                return (
                    <Col xs='3' key={product.id}>
                        <Card onClick={() => this.addDetail(product.productName, product.productDescription, product.productPrice, product.id, product.productType)} className='menuItem my-1'>
                            <CardTitle>
                                <h4>{product.productName.toUpperCase()}</h4>
                                <p>Harga: Rp. {product.productPrice}</p>
                            </CardTitle>
                        </Card>
                    </Col>
                )
            }
        })
        return result
    }
    renderPaket = () => {
        let result = this.state.arrMenu.map(product => {
            if (product.productType === 'Paket') {
                return (
                    <Col xs='3' key={product.id}>
                        <Card onClick={() => this.addDetail(product.productName, product.productDescription, product.productPrice, product.id, product.productType)} className='menuItem my-1'>
                            <CardTitle>
                                <h4>{product.productName.toUpperCase()}</h4>
                                <p>Harga: Rp. {product.productPrice}</p>
                            </CardTitle>
                        </Card>
                    </Col>
                )
            }
        })
        return result
    }
    renderTambahan = () => {
        let result = this.state.arrMenu.map(product => {
            if (product.productType === 'Tambahan') {
                return (
                    <Col xs='3' key={product.id}>
                        <Card onClick={() => this.addDetail(product.productName, product.productDescription, product.productPrice, product.id, product.productType)} className='menuItem my-1'>
                            <CardTitle>
                                <h4>{product.productName.toUpperCase()}</h4>
                                <p>Harga: Rp. {product.productPrice}</p>
                            </CardTitle>
                        </Card>
                    </Col>
                )
            }
        })
        return result
    }
    addDetail = (name, description, price, id, type) => {
        this.setState({
            productDetail: [{ name, description, price, id, type }]
        })
    }
    delDetail = () => {
        // console.log(this.state.arrOrder)
        this.setState({
            productDetail: []
        })
    }
    decQty = () => {
        if (this.state.qty > 0) {
            this.setState({ qty: this.state.qty - 1 })
        }
    }
    incQty = () => {
        if (this.state.qty >= 0) {
            this.setState({ qty: this.state.qty + 1 })
        }
    }
    decQty5 = () => {
        if (this.state.qty >= 5) {
            this.setState({ qty: this.state.qty - 5 })
        }
        if (this.state.qty < 5) {
            this.setState({ qty: 0 })
        }
    }
    incQty5 = () => {
        if (this.state.qty >= 0) {
            this.setState({ qty: this.state.qty + 5 })
        }
    }
    resetQty = () => {
        if (this.state.qty >= 0) {
            this.setState({ qty: 0 })
        }
    }
    addOrder = async (name, price, id, type) => {
        let qty = this.state.qty
        if (qty === 0) {
            return alert('Please insert quantity')
        }

        return this.setState({
            arrOrder: [...this.state.arrOrder, {
                productName: name,
                productPrice: price,
                productId: id,
                productType: type,
                qty
            }]
        })

    }

    jedor = () => {
        console.log(this.state.arrOrder)

    }

    inputQty = (e) => {
        let qty = parseInt(e.target.value)
        if (isNaN(qty)) {
            return this.setState({ qty: 0 })
        }
        this.setState({ qty: qty })
    }

    showDetail = () => {
        let result = this.state.productDetail.map(product => {
            return (
                <Row className='mt-3 mb-3' key={product.id}>
                    <Col xs='3'>
                        <CardImg left={true.toString()} className='mx-auto my-2' src={darwin} alt='' />
                        <button className='btn btn-warning btn-block h-25' onClick={() => this.addOrder(product.name, product.price, product.id, product.type)}>Add order</button>
                    </Col>
                    <Col xs='8' className='align-content-center'>
                        <Card className='text-center '>
                            <CardTitle className='mt-2'>
                                <h3 className="text-center">
                                    {product.name}
                                </h3>
                            </CardTitle>
                        </Card>
                        <Card className='text-center mt-2 pb-2 overflowTest'>
                            <CardTitle className='mt-2'>
                                <h3>
                                    {product.description}
                                </h3>
                            </CardTitle>
                        </Card>
                        <Card className='mt-3 '>
                            <CardTitle className='my-3 text-center'>
                                <h5 className='mb-0'>
                                    Qty :
                                    <span className='ml-3'>
                                        <button className='btn btn-info mr-2' onClick={this.decQty5}>-5</button>
                                        <button className='btn btn-info mr-2' onClick={this.decQty}>-</button>
                                        <input type="text" min='0' onChange={(e) => this.inputQty(e)} value={this.state.qty} />
                                        <button className='btn btn-info ml-2' onClick={this.incQty}>+</button>
                                        <button className='btn btn-info ml-2' onClick={this.incQty5}>+5</button>
                                        <button className='btn btn-danger ml-2' onClick={this.resetQty}>Reset</button>
                                    </span>
                                </h5>
                            </CardTitle>
                        </Card>
                    </Col>
                    <Col className='pl-0' xs='1'>
                        <button className='h-100 btn btn-danger' onClick={this.delDetail}>Cancel</button>
                    </Col>
                </Row >
            )
        })
        return result
    }

    resetDetail = () => {
        this.setState({ productDetail: [] })
    }

    resetTable = () => {
        this.props.delTableNum()
    }
    handleDelArr = (_arrOrder) => {
        this.setState({
            arrOrder: _arrOrder
        })
    }

    render() {
        if (this.props.userName && (this.props.userType === "cashier" || this.props.userType === "waiter") && this.props.tableNum) {
            return (
                <div className='app' >
                    <Sidebar onDelArr={this.handleDelArr} order={this.state.arrOrder} tableNum={this.props.tableNum} />
                    <div className='container'>
                        {
                            this.state.productDetail.length
                                ?
                                this.showDetail()
                                :
                                ''
                        }
                        <Row className='container mx-auto menu'>
                            <Col xs='11' className='border-bottom border-top border-dark'>
                                <h2>LAUK</h2>
                                <Row className='produk text-center '>
                                    {this.renderLauk()}
                                </Row>
                            </Col>
                            <Col xs='11' className='border-bottom border-top border-dark'>
                                <h2>PAKET</h2>
                                <Row className='produk text-center'>
                                    {this.renderPaket()}
                                </Row>
                            </Col>
                            <Col xs='11' className='border-bottom border-top border-dark'>
                                <h2>TAMBAHAN</h2>
                                <Row className='produk text-center'>
                                    {this.renderTambahan()}
                                </Row>
                            </Col>

                        </Row>
                    </div>
                    <Link to='/table' className='d-flex justify-content-end '>
                        <button className='btn btn-primary' onClick={this.resetTable}>Back</button>
                    </Link>
                    <div key='extra' style={{ height: 600 }}>

                    </div>
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
        else if (!this.props.tableNum) {
            return (
                <Redirect to='/table' />
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

export default connect(mapStateToProps, { delTableNum })(Order)


