import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import axios from 'axios';
import url from '../support/url'

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
                url + '/menu'
            )
            if(res.data.error) return alert(res.data.error)
            this.setState({ arrMenu: res.data.menu })
            console.log(res.data.menu)
        } catch (error) {
            console.log(error)
        }
    }

    renderMenuSet = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'MenuSet') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }

    renderMainCourse = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Main Course') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }

    renderSideDish = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Side Dish') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }

    renderBeverage = () => {
        return this.state.arrMenu.map(product => {
            if (product.productType === 'Beverage') {
                return (
                    <DropdownItem key={product.id} onFocus={() => this.setState({ menu: product.productName, type: 'lauk', price: product.productPrice, id: product.id })}>{product.productName}</DropdownItem>
                )
            }
        })
    }

    addItem = async (e) => {
        e.preventDefault()
        let qty = this.qty.value
        let item = this.state.menu
        let name = this.name.value

        let data = this.state.arrMenu.filter(val => {
            return val.productName === item
        })
        if (!qty) {
            return alert('Please insert the correct quantity')
        }
        if (!name) {
            return alert('Please input name first')
        }
        if (!item) {
            return alert('Please select menu item')
        }
        let price = this.state.price
        let filtered = this.state.itemList.filter(val => {
            return val.item === this.state.menu
        })
        if (filtered.length > 0) {
            let sum = parseInt(filtered[0].qty) + parseInt(qty)
            let array = [...this.state.itemList]
            
            let index = array.map(function (e) { return e.item; }).indexOf(this.state.menu);
            if (index === -1) return alert('No index')
            array.splice(index, 1)

            this.qty.value = ''

            return this.setState({
                itemList: [...array, {
                    id: data[0].id,
                    item: item,
                    price: price,
                    name: name,
                    qty: parseInt(sum)
                }],
                menu: ''
            })
        }
        this.qty.value = ''
        this.setState({
            itemList: [...this.state.itemList, {
                id: data[0].id,
                item: item,
                price: price,
                name: name,
                qty: parseInt(qty)
            }],
            menu: ''
        })
    }

    dor = () => {
        console.log(this.state.itemList)
    }

    delete = (item) => {
        let array = [...this.state.itemList]
        let index = array.map(function (e) { return e.item; }).indexOf(item);
        if (index === -1) return alert('No index')
        array.splice(index, 1)
        // console.log(array)
        this.setState({ itemList: array })
    }

    renderItemList = () => {
        let result = this.state.itemList.map(val => {
            return (
                <tr>
                    <td>{val.item}</td>
                    <td>{val.price}</td>
                    <td>{val.qty}</td>
                    <td>{val.qty * val.price}</td>
                    <td><button className='btn btn-danger' onClick={() => this.delete(val.item)}>X</button></td>
                </tr>
            )
        })
        return result
    }

    onSubmit = async () => {
        let menuItem = this.state.itemList
        let name = this.name.value
        let companyName = this.companyName.value
        let companyAddress = this.companyAddress.value
        let address = this.address.value
        let email = this.email.value
        let nett = this.nett.value

        menuItem.forEach(function(v) {
            delete v.item;
        });
        menuItem.forEach(function(v) {
            delete v.price;
        });
        menuItem.forEach(function(v) {
            delete v.name;
        });
        console.log(menuItem)


        if (!name || !address || !email || !nett) {
            return alert('Please fill the form correctly')
        }
        if (!menuItem) {
            return alert('Please select menu item')
        }
        try {
            let res = await axios.post(
                url + '/reservation',
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
            if(res.data.error) return alert(res.data.error)
            console.log(res)
            alert('success')

            this.setState({ itemList: [] })
            this.name.value = ''
            this.companyName.value = ''
            this.companyAddress.value = ''
            this.address.value = ''
            this.email.value = ''
            this.nett.value = ''
            this.componentDidMount()
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
                                    <h6> (Optional) </h6>
                                    <input className='form-control' type="text" ref={input => { this.companyName = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Company address : </h3>
                                    <h6> (Optional) </h6>
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
                                            <DropdownItem header>MenuSet</DropdownItem>
                                            {this.renderMenuSet()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem header>MainCourse</DropdownItem>
                                            {this.renderMainCourse()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem header>SideDish</DropdownItem>
                                            {this.renderSideDish()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem header>Beverage</DropdownItem>
                                            {this.renderBeverage()}
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
                                                        <th>SUM</th>
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
