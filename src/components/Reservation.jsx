import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import axios from 'axios';

export class Reservation extends Component {
    state = {
        menu: '',
        type: '',
        price: 0,
        id: 0,
        arrMenu: [],
        itemList: []
    }

    componentDidMount = async () => {
        try {
            let res = await axios.get(
                'http://localhost:2000/menu'
            )
            this.setState({ arrMenu: res.data })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    renderLauk = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Lauk') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })

    }
    renderTambahan = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Tambahan') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }
    renderPaket = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Paket') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }

    addItem = async (e) => {
        e.preventDefault()
        let qty = this.qty.value

        if (!qty) {
            return alert('Please insert the correct quantity')
        }
        let item = this.state.menu
        // try {
        //     let res = await axios.get(
        //         `http://localhost:2000/order?productId=${this.state.id}&customerTable=${this.props.tableNum}`
        //     )
        //     if (!res.data) {
        //         let resp = await axios.post(
        //             'http://localhost:2000/orders',
        //             {
        //                 productName: item,
        //                 productType: this.state.type,
        //                 productPrice: this.state.price,
        //                 productId: this.state.id,
        //                 qty: qty,
        //                 customerTable: this.props.tableNum
        //             }
        //         )
        //         alert('Item added')
        //         return console.log(resp)
        //     }

        //     let resp = await axios.patch(
        //         'http://localhost:2000/orders',
        //         {
        //             qty: qty,
        //             customerTable: this.props.tableNum
        //         }
        //     )
        //     alert('Item added')
        //     console.log(resp)
        // } catch (error) {
        //     console.log(error)
        // }


        this.setState({
            itemList: [...this.state.itemList, { item, qty }]
        })
    }

    renderItemList = () => {
        let result = this.state.itemList.map(val => {
            return (
                `item: ${val.item}  X ${val.qty}\n`
            )
        })
        return result
    }

    onSubmit = async () => {
        let menuItem = this.itemList.props.value
        let name = this.name.value
        let companyName = this.companyName.value
        let companyAddress = this.companyName.value
        let address = this.address.value
        let email = this.email.value
        let nett = this.nett.value
        if (!name || !address || !email || !nett) {
            return alert('Please fill the form correctly')
        }
        if (!menuItem) {
            return alert('Please select menu item')
        }
        try {
            if (!companyAddress || !companyName) {
                let res = await axios.post(
                    'http://localhost:2000/reservation',
                    {
                        name,
                        address,
                        email,
                        menuItem,
                        nett
                    }
                )
                console.log(res)
                alert('success')
            } else {
                let res = await axios.post(
                    'http://localhost:2000/reservation',
                    {
                        name,
                        address,
                        email,
                        menuItem,
                        nett,
                        companyName,
                        companyAddress
                    }
                )
                console.log(res)
                alert('success')
            }

        } catch (error) {
            console.log(error)
        }


    }



    render() {
        if (this.props.userName && this.props.userType === "cashier") {
            return (
                <div>
                    <div className='card col-6 mx-auto mt-5'>
                        <div className='card-body' >
                            <div className='card-title border-bottom border-dark'>
                                <h1>
                                    Reservation form :
                            </h1>
                            </div>
                            <form className='form-group mb-0'>
                                <div className='card-title'>
                                    <h3>Name : </h3>
                                    <input className='form-control' type="text" ref={input => { this.name = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Company name : </h3>
                                    <input className='form-control' type="text" ref={input => { this.companyName = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Company address : </h3>
                                    <textarea className='form-control' type='text' ref={input => { this.companyAddress = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Personal address : </h3>
                                    <textarea className='form-control' type='text' ref={input => { this.address = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Email : </h3>
                                    <input className='form-control' type='email' ref={input => { this.email = input }} />
                                </div>
                                <div className='border-bottom border-info'>
                                    <h5>Reservation details</h5>
                                </div>
                                <div className='card-title'>
                                    <h3>Nett : </h3>
                                    <input className='form-control' min='0' type='number' ref={input => { this.nett = input }} />
                                </div>
                                <div className='card-title'>
                                    <div className='border-bottom border-info'>
                                        <h5>Add menu item</h5>
                                    </div>
                                    <h4>List menu : </h4>
                                    <UncontrolledButtonDropdown direction='down' className='btn-block'>
                                        <DropdownToggle caret >
                                            {
                                                this.state.menu
                                                    ?
                                                    this.state.menu
                                                    :
                                                    'Select one...'
                                            }
                                        </DropdownToggle>
                                        <DropdownMenu style={{ overflow: 'auto', height: 150 }} className='mr-2 w-100'>
                                            <DropdownItem header>Lauk</DropdownItem>
                                            {this.renderLauk()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem header>Tambahan</DropdownItem>
                                            {this.renderTambahan()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem header>Paket</DropdownItem>
                                            {this.renderPaket()}
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </div>
                                <div className='card-title'>
                                    <h4>Qty : </h4>
                                    <input className='form-control' type='number' ref={input => { this.qty = input }} />
                                </div>
                                <div>
                                    <button className='btn btn-block btn-success' onClick={this.addItem}>Add item</button>
                                </div>
                                {
                                    this.state.itemList.length === 0
                                        ?
                                        ''
                                        :
                                        <div className='card-title'>
                                            <h4 className="display-4 text-center my-4">Item list</h4>
                                            <table className="table table-hover text-center">
                                                <thead>
                                                    <tr>
                                                        <th>PRODUCT</th>
                                                        <th>PRICE</th>
                                                        <th>QTY</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.renderItemList()}
                                                </tbody>
                                            </table>
                                        </div>
                                }

                                <button className='m-0 p-0' style={{ opacity: 0 }} onClick={this.onSubmit}>
                                </button>
                            </form>
                            <button type='submit' className='btn btn-block btn-info' onClick={this.onSubmit}>SUBMIT</button>
                        </div>
                    </div>
                    <div style={{ height: 300 }} className='container'>
                    </div>
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
        userType: state.auth.userType,
        tableNum: state.tableNum.tableNum
    }
}

export default connect(mapStateToProps, null)(Reservation)
