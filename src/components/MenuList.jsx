import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import url from '../support/url'
import { FaCaretDown,FaCaretUp,FaBars } from 'react-icons/fa'

import {
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { Transition } from 'react-transition-group'



let urlLokal = `http://localhost:2000/menu/`
// TRANSITION DURATION
const duration = 500

// TRANSITION
const sidebarStyle = {
    transition: `width ${duration}ms`
}

// WIDTH SETTING
const sidebarTransitionStyles = {
    entering: { width: 0 },
    entered: { width: '300px' },
    exiting: { width: '300px' },
    exited: { width: 0 }
}

// OPACITY TRANSITION DURATION (same as width duration)
const linkStyle = {
    transition: `opacity ${duration}ms`
}

// LINK OPACITY SETTING
const linkTransitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}

export class MenuList extends Component {

    state = {
        arrMenu: [],
        arrFilter: [],
        isOpen: false,
        dropdown: false,
        saveType: '',
        sort: 'id',
        toggleCaret: false
    }

    componentDidMount() {
        axios.get(
            url + '/menu'
        )
            .then(res => {
                if(res.data.error) return alert(res.data.error)
                this.setState({ arrMenu: res.data.menu, arrFilter: res.data.menu })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onSearch = () => {
        let type = this.state.saveType
        let name = this.name.value.toLowerCase()
        let min = parseInt(this.min.value)
        let max = parseInt(this.max.value)
        let hasilFilter = this.state.arrMenu.filter((product) => {
            let productLowercase = product.productName.toLowerCase()

            if (isNaN(min) && isNaN(max) && !type) {
                return productLowercase.includes(name)
            } else if (isNaN(min) && isNaN(max) && !name) {
                return product.productType === type
            } else if (isNaN(min) && !type && !name) {
                return product.productPrice <= max
            } else if (isNaN(min) && !type && !name) {
                return product.productPrice >= min
            } else if (isNaN(min) && !type) {
                return productLowercase.includes(name) && product.productPrice <= max
            } else if (isNaN(max) && !type) {
                return productLowercase.includes(name) && product.productPrice >= min
            } else if (isNaN(max) && !name) {
                return product.productType === type && product.productPrice >= min
            } else if (isNaN(min) && !name) {
                return product.productType === type && product.productPrice <= max
            } else if (isNaN(min) && isNaN(max)) {
                return product.productType === type && productLowercase.includes(name)
            } else if (!type) {
                return product.productPrice <= max && product.productPrice >= min && productLowercase.includes(name)
            } else if (!name) {
                return product.productPrice <= max && product.productPrice >= min && product.productType === type
            } else {
                return product.productPrice <= max && product.productPrice >= min && product.productType === type && productLowercase.includes(name)
            }
        })

        this.setState({ arrFilter: hasilFilter })
    }

    toggleDropdown = () => {
        this.setState({ dropdown: !this.state.dropdown })
    }

    resetFilter = () => {
        this.name.value = ''
        this.min.value = ''
        this.max.value = ''
        this.setState({ saveType: '', arrFilter: this.state.arrMenu })
    }

    getType = (type) => {
        this.setState({ saveType: type })
    }

    fnDropdown = async (type) => {
        try {
            await this.getType(type)
            await this.onSearch()
        } catch (error) {
            console.log(error)
        }
    }

    renderDropdown = () => {
        let category = this.state.arrMenu.map(val => { return val.productType })
        let hasil = [...new Set(category)]

        return hasil.map(val => {
            return (
                <DropdownItem onFocus={() => this.fnDropdown(val)}>
                    {val}
                </DropdownItem>
            )
        })
    }

    // SIDEBAR FRAME
    renderLinks = () => {
        return <Transition in={this.state.isOpen} timeout={duration}>
            {(state) => (
                <div className='mt-2' style={{
                    ...linkStyle,
                    ...linkTransitionStyles[state]
                }}>
                    <div className='container'>
                        <h1 className="border-bottom border-dark card-title">
                            Search
                        </h1>
                        <form className='form-group'>
                            <input type="text" onChange={this.onSearch} className="form-control" ref={(input) => { this.name = input }} />
                            <h4>Price</h4>
                            <input placeholder="Minimum" onChange={this.onSearch} ref={(input) => { this.min = input }} type="number" className="form-control mb-2 " />
                            <input placeholder="Maximum" onChange={this.onSearch} ref={(input) => { this.max = input }} type="number" className="form-control " />
                        </form>
                        <ButtonDropdown isOpen={this.state.dropdown} toggle={this.toggleDropdown}>
                            <DropdownToggle caret>
                                {
                                    this.state.saveType
                                        ?
                                        this.state.saveType
                                        :
                                        'Select one...'
                                }
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.renderDropdown()}
                            </DropdownMenu>
                        </ButtonDropdown>
                        <button onClick={this.resetFilter} className='btn btn-danger btn-block mt-3'>Reset filter</button>
                    </div>
                </div>
            )
            }
        </Transition>
    }

    // TOGGLE SIDEBAR
    toggleSidebar = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }))
    }

    renderMenu = () => {
        return this.state.arrFilter.map(val => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td><img style={{width:50}} src={urlLokal+val.productPhoto} alt={val.productName} /></td>
                    <td>{val.productName}</td>
                    <td>{val.productPrice}</td>
                    <td>{val.productType}</td>
                    <td>{val.productDescription}</td>
                </tr>
            )
        })
    }

    compareValues = (key, order = 'asc') => {
        return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (isNaN(parseInt(a[key])))
            ? a[key].toUpperCase() : parseInt(a[key])
        const varB = (isNaN(parseInt(b[key])))
            ? b[key].toUpperCase() : parseInt(b[key])
    
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
        };
    }

    onSort = (key,order= 'asc') => {
        let dor = this.state.arrFilter.sort(this.compareValues(key,order ))
        this.setState({arrFilter:dor,sort:key,toggleCaret: !this.state.toggleCaret})
    }

    render() {
        if (this.props.userName && this.props.userType === "admin") {
            if(!this.state.arrMenu.length){
                return(
                    <div className='text-center'>
                        <h1>
                            Loading...
                        </h1>
                    </div>
                )
            }
            return (
                <div className='app'>
                    <div className='sidebar-container'>
                        {
                            this.state.isOpen === true
                                ?
                                <div className='d-flex '>
                                    <button onClick={this.toggleSidebar} className='btn btn-block btn-primary py-3 mb-2 mx-0 px-0'>Close</button>
                                </div>
                                :
                                <div className='d-flex h-100 justify-content-start'>
                                    <button onClick={this.toggleSidebar} className='btn btn-primary btn-block p-2'> <FaBars size={30}/> </button>
                                </div>

                        }
                        {
                            this.state.isOpen === true
                                ?
                                <div >
                                    <Transition in={this.state.isOpen} timeout={duration}>
                                        {(state) => (
                                            <div className="sidebar" style={{
                                                ...sidebarStyle,
                                                ...sidebarTransitionStyles[state]
                                            }}>
                                                <div>
                                                    {this.renderLinks()}
                                                </div>
                                            </div>
                                        )}
                                    </Transition>
                                </div>
                                :
                                ''
                        }
                    </div>
                    <table className='table float table-hover table-striped text-center'>
                        <thead className='thead-dark'>
                            <th>
                                ID
                                {
                                    this.state.toggleCaret && this.state.sort === 'id'
                                    ?

                                        <FaCaretUp onClick={() =>this.onSort('id','desc')}/>

                                    :

                                        <FaCaretDown onClick={() =>this.onSort('id','asc')}/>
                                }
                            </th>
                            <th>PHOTO</th>
                            <th>
                                PRODUCT-NAME
                                {
                                    this.state.toggleCaret && this.state.sort === 'productName'
                                    ?

                                        <FaCaretUp onClick={() =>this.onSort('productName','desc')}/>

                                    :

                                        <FaCaretDown onClick={() =>this.onSort('productName','asc')}/>
                                }
                            </th>
                            <th>
                                PRODUCT-PRICE
                                {
                                    this.state.toggleCaret && this.state.sort === 'productPrice'
                                    ?

                                        <FaCaretUp onClick={() =>this.onSort('productPrice','desc')}/>

                                    :

                                        <FaCaretDown onClick={() =>this.onSort('productPrice','asc')}/>
                                }
                            </th>
                            <th>
                                PRODUCT-TYPE
                                {
                                    this.state.toggleCaret && this.state.sort === 'productType'
                                    ?

                                        <FaCaretUp onClick={() =>this.onSort('productType','desc')}/>

                                    :

                                        <FaCaretDown onClick={() =>this.onSort('productType','asc')}/>
                                }
                            </th>
                            <th>
                                PRODUCT-DESCRIPTION
                                {
                                    this.state.toggleCaret && this.state.sort === 'productDescription'
                                    ?

                                        <FaCaretUp onClick={() =>this.onSort('productDescription','desc')}/>

                                    :

                                        <FaCaretDown onClick={() =>this.onSort('productDescription','asc')}/>
                                }
                            </th>
                        </thead>
                        <tbody>
                            {this.renderMenu()}
                        </tbody>
                    </table>
                </div>
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
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

export default connect(mapStateToProps, null)(MenuList)
